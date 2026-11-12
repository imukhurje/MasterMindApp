import { api } from '../../../api/client';

// These GET routes are confirmed by the supplied API responses.
export const CLASSROOM_API = {
  me: '/api/me',
  onboarding: '/api/settings/v1/onboarding',
  classGroups: '/api/class-groups',
  videoAccounts: '/api/video-accounts?provider=google',
  list: '/api/classrooms',
  // Awaiting backend documentation. Do not assume GET /api/classrooms/:id exists.
  detail: null,
  create: null,
};

export function normalizeClassroom(item) {
  const id = item?.id ?? item?.classroom_id;
  return {
    id: id == null ? '' : String(id),
    title: String(
      item?.name ??
        item?.title ??
        item?.classroom_name ??
        `Classroom ${id ?? ''}`,
    ).trim(),
    description: String(item?.description ?? ''),
    className: String(
      item?.class_name ??
        item?.class_group?.name ??
        item?.class_group_name ??
        '',
    ),
    section: String(item?.section ?? item?.class_group?.section ?? ''),
    teacher: String(item?.teacher?.name ?? item?.teacher_name ?? ''),
    students: item?.students_count ?? item?.student_count ?? null,
    subject: String(item?.subject?.name ?? item?.subject_name ?? ''),
    raw: item,
  };
}

export async function loadClassroomInitialData() {
  // /api/classrooms is the only source for the Classroom list.
  // Class groups from /api/class-groups are NOT classroom records.
  const entries = await Promise.allSettled([
    api(CLASSROOM_API.me),
    api(CLASSROOM_API.onboarding),
    api(CLASSROOM_API.classGroups),
    api(CLASSROOM_API.videoAccounts),
    api(CLASSROOM_API.list),
  ]);
  const [me, onboarding, classGroups, videoAccounts, classrooms] = entries;
  if (classrooms.status !== 'fulfilled') throw classrooms.reason;
  const data = classrooms.value;
  const rows = Array.isArray(data?.items) ? data.items : null;
  if (!rows)
    throw new Error(
      'Unexpected /api/classrooms response: items must be an array.',
    );
  return {
    items: rows.map(normalizeClassroom).filter(item => item.id !== ''),
    me: me.status === 'fulfilled' ? me.value : null,
    onboarding: onboarding.status === 'fulfilled' ? onboarding.value : null,
    classGroups:
      classGroups.status === 'fulfilled' &&
      Array.isArray(classGroups.value?.classes)
        ? classGroups.value.classes
        : [],
    videoAccounts:
      videoAccounts.status === 'fulfilled' &&
      Array.isArray(videoAccounts.value?.items)
        ? videoAccounts.value.items
        : [],
    optionalErrors: entries
      .slice(0, 4)
      .map((entry, index) =>
        entry.status === 'rejected'
          ? {
              endpoint: Object.values(CLASSROOM_API)[index],
              message: entry.reason?.message,
            }
          : null,
      )
      .filter(Boolean),
  };
}

export async function getClassroom(id, fallback) {
  if (!CLASSROOM_API.detail) return fallback;
  const data = await api(CLASSROOM_API.detail(id));
  return normalizeClassroom(data?.classroom ?? data?.data ?? data);
}

export async function createClassroom(payload) {
  if (!CLASSROOM_API.create)
    throw new Error('Create Classroom API is not configured yet.');
  return api(CLASSROOM_API.create, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
