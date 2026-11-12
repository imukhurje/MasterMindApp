// src/screens/Admin/Management/AdminManagementDashboard.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import Svg, {
  Circle,
  Path,
  Rect,
  Line,
  Text as SvgText,
} from 'react-native-svg';

import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';

import styles from './AdminManagementDashboard.styles';

function formatCurrency(value) {
  const amount = Number(value) || 0;

  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;
}

function formatCompactCurrency(value) {
  const amount = Number(value) || 0;

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }

  return `₹${amount}`;
}

function normalizeAnalytics(response) {
  return {
    classes: Array.isArray(response?.classes) ? response.classes : [],

    subjects: Array.isArray(response?.subjects) ? response.subjects : [],

    fees: {
      total: Number(response?.fees?.total) || 0,
      collected: Number(response?.fees?.collected) || 0,
      remaining: Number(response?.fees?.remaining) || 0,
    },

    financialSummary: Array.isArray(response?.financial_summary)
      ? response.financial_summary
      : [],
  };
}

const PIE_COLORS = [
  '#60A5FA',
  '#34D399',
  '#FBBF24',
  '#F472B6',
  '#A78BFA',
  '#22D3EE',
  '#FB923C',
  '#4ADE80',
  '#E879F9',
  '#F87171',
];

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),

    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function createPieSlicePath(centerX, centerY, radius, startAngle, endAngle) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);

  const end = polarToCartesian(centerX, centerY, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

function PieChartCard({ title, items, emptyText }) {
  const chartItems = useMemo(
    () =>
      (Array.isArray(items) ? items : []).filter(
        item => Number(item?.value) > 0,
      ),
    [items],
  );

  const total = useMemo(
    () => chartItems.reduce((sum, item) => sum + (Number(item?.value) || 0), 0),
    [chartItems],
  );

  const slices = useMemo(() => {
    if (total <= 0 || chartItems.length === 0) {
      return [];
    }

    let currentAngle = 0;

    return chartItems.map((item, index) => {
      const value = Number(item?.value) || 0;

      const sliceAngle = (value / total) * 360;

      const result = {
        ...item,

        value,

        color: PIE_COLORS[index % PIE_COLORS.length],

        startAngle: currentAngle,

        endAngle: currentAngle + sliceAngle,
      };

      currentAngle += sliceAngle;

      return result;
    });
  }, [chartItems, total]);

  return (
    <View style={styles.analyticsCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>

        <View style={styles.cardCountBadge}>
          <Text style={styles.cardCountText}>{chartItems.length}</Text>
        </View>
      </View>

      {slices.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="chart-pie" size={34} color="#718096" />

          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        <>
          <View style={styles.pieChartWrapper}>
            <Svg width={170} height={170} viewBox="0 0 170 170">
              {slices.length === 1 ? (
                <Circle cx="85" cy="85" r="70" fill={slices[0].color} />
              ) : (
                slices.map((slice, index) => (
                  <Path
                    key={`${slice?.label}-${index}`}
                    d={createPieSlicePath(
                      85,
                      85,
                      70,
                      slice.startAngle,
                      slice.endAngle,
                    )}
                    fill={slice.color}
                  />
                ))
              )}
            </Svg>

            <View style={styles.pieCenterLabel}>
              <Text style={styles.pieTotalValue}>{total}</Text>

              <Text style={styles.pieTotalLabel}>Total</Text>
            </View>
          </View>

          <View style={styles.pieLegend}>
            {slices.map((item, index) => {
              const percentage =
                total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';

              return (
                <View
                  key={`${item?.label}-legend-${index}`}
                  style={styles.pieLegendRow}
                >
                  <View
                    style={[
                      styles.pieLegendDot,
                      {
                        backgroundColor: item.color,
                      },
                    ]}
                  />

                  <Text numberOfLines={1} style={styles.pieLegendLabel}>
                    {item?.label || 'Unknown'}
                  </Text>

                  <Text style={styles.pieLegendValue}>{item.value}</Text>

                  <Text style={styles.pieLegendPercentage}>{percentage}%</Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

function FinancialSummary({ items }) {
  const chartItems = useMemo(
    () => (Array.isArray(items) ? items : []),
    [items],
  );

  const maxAmount = useMemo(() => {
    if (chartItems.length === 0) {
      return 0;
    }

    return Math.max(
      ...chartItems.flatMap(item => [
        Number(item?.income) || 0,
        Number(item?.expenses) || 0,
      ]),
      0,
    );
  }, [chartItems]);

  const chartMax = useMemo(() => {
    if (maxAmount <= 0) {
      return 100;
    }

    /*
     * Give the highest bar a little headroom.
     */
    return maxAmount * 1.15;
  }, [maxAmount]);

  if (chartItems.length === 0) {
    return (
      <View style={styles.analyticsCard}>
        <Text style={styles.cardTitle}>Monthly Income & Expenses</Text>

        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="chart-bar" size={30} color="#718096" />

          <Text style={styles.emptyText}>No financial data available.</Text>
        </View>
      </View>
    );
  }

  /*
   * SVG coordinate system.
   */
  const svgWidth = 360;
  const svgHeight = 250;

  const marginLeft = 50;
  const marginRight = 12;
  const marginTop = 18;
  const marginBottom = 42;

  const chartWidth = svgWidth - marginLeft - marginRight;

  const chartHeight = svgHeight - marginTop - marginBottom;

  const groupWidth = chartWidth / Math.max(chartItems.length, 1);

  const barWidth = Math.min(15, groupWidth * 0.27);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View style={styles.analyticsCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Monthly Income & Expenses</Text>
      </View>

      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.incomeDot]} />

          <Text style={styles.legendText}>Income</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.expenseDot]} />

          <Text style={styles.legendText}>Expenses</Text>
        </View>
      </View>

      <View style={styles.barChartWrapper}>
        <Svg
          width="100%"
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {/* Horizontal grid and Y axis values */}
          {yTicks.map(tick => {
            const y = marginTop + chartHeight - chartHeight * tick;

            const tickValue = chartMax * tick;

            return (
              <React.Fragment key={`grid-${tick}`}>
                <Line
                  x1={marginLeft}
                  y1={y}
                  x2={svgWidth - marginRight}
                  y2={y}
                  stroke="#294B69"
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? undefined : '4 4'}
                />

                <SvgText
                  x={marginLeft - 7}
                  y={y + 4}
                  fill="#A8B6C9"
                  fontSize="9"
                  textAnchor="end"
                >
                  {formatCompactCurrency(tickValue)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Bars */}
          {chartItems.map((item, index) => {
            const income = Number(item?.income) || 0;

            const expenses = Number(item?.expenses) || 0;

            const incomeHeight =
              chartMax > 0 ? (income / chartMax) * chartHeight : 0;

            const expenseHeight =
              chartMax > 0 ? (expenses / chartMax) * chartHeight : 0;

            const groupCenter =
              marginLeft + groupWidth * index + groupWidth / 2;

            const incomeX = groupCenter - barWidth - 2;

            const expenseX = groupCenter + 2;

            const baseY = marginTop + chartHeight;

            return (
              <React.Fragment key={item?.key || String(index)}>
                {/* Income */}
                <Rect
                  x={incomeX}
                  y={baseY - incomeHeight}
                  width={barWidth}
                  height={incomeHeight}
                  rx="3"
                  fill="#34D399"
                />

                {/* Expense */}
                <Rect
                  x={expenseX}
                  y={baseY - expenseHeight}
                  width={barWidth}
                  height={expenseHeight}
                  rx="3"
                  fill="#F472B6"
                />

                {/* Month */}
                <SvgText
                  x={groupCenter}
                  y={baseY + 20}
                  fill="#DCE7F5"
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {String(item?.label || '-')}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      <View style={styles.financialSummaryFooter}>
        {chartItems.map(item => {
          const income = Number(item?.income) || 0;

          const expenses = Number(item?.expenses) || 0;

          if (income === 0 && expenses === 0) {
            return null;
          }

          return (
            <View
              key={`summary-${item?.key}`}
              style={styles.financialSummaryRow}
            >
              <Text style={styles.financialSummaryMonth}>{item?.label}</Text>

              <Text style={styles.financialIncomeText}>
                Income: {formatCurrency(income)}
              </Text>

              <Text style={styles.financialExpenseText}>
                Expenses: {formatCurrency(expenses)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function AdminManagementDashboard({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isWideScreen = width >= 700;

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [analytics, setAnalytics] = useState(() => normalizeAnalytics({}));

  const loadDashboard = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [meResponse, onboardingResponse, analyticsResponse] =
          await Promise.all([
            api('/api/me'),

            api('/api/settings/v1/onboarding'),

            api('/api/management-dashboard/analytics'),
          ]);

        const role = String(
          meResponse?.primary_role ||
            meResponse?.role ||
            meResponse?.actual_primary_role ||
            meResponse?.actual_role ||
            '',
        )
          .trim()
          .toLowerCase();

        const hasAccess =
          meResponse?.is_admin === true ||
          meResponse?.is_super_admin === true ||
          role === 'admin' ||
          role === 'super_admin';

        if (!hasAccess) {
          Alert.alert(
            'Access denied',
            'Only administrators can view the management dashboard.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
          );

          return;
        }

        setMe(meResponse || null);

        setOnboarding(onboardingResponse || null);

        setAnalytics(normalizeAnalytics(analyticsResponse));
      } catch (error) {
        console.log('Management dashboard load error:', error);

        Alert.alert(
          'Management Dashboard',
          error?.message || 'Could not load management dashboard.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      loadDashboard();

      return undefined;
    }, [loadDashboard]),
  );

  const schoolName = onboarding?.organization?.school_name || 'School';

  const feeItems = [
    {
      key: 'total',
      title: 'Total fees',
      value: analytics.fees.total,
      icon: 'cash-multiple',
    },
    {
      key: 'collected',
      title: 'Collected',
      value: analytics.fees.collected,
      icon: 'cash-check',
    },
    {
      key: 'remaining',
      title: 'Remaining',
      value: analytics.fees.remaining,
      icon: 'cash-clock',
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading management dashboard...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 4),
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadDashboard({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroTextArea}>
              <Text style={styles.heroTitle}>Management Dashboard</Text>

              <Text style={styles.heroSubtitle}>
                At-a-glance academic and fee insights
              </Text>
            </View>

            <View style={styles.heroIcon}>
              <MaterialCommunityIcons
                name="view-dashboard-outline"
                size={24}
                color="#7DD3FC"
              />
            </View>
          </View>

          <View style={styles.schoolRow}>
            <MaterialCommunityIcons
              name="school-outline"
              size={15}
              color="#A8B6C9"
            />

            <Text numberOfLines={1} style={styles.schoolName}>
              {schoolName}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Fee Overview</Text>

        <View style={[styles.feeGrid, !isWideScreen && styles.feeGridMobile]}>
          {feeItems.map(item => (
            <View
              key={item.key}
              style={[
                styles.feeCard,
                isWideScreen ? styles.feeCardWide : styles.feeCardMobile,
              ]}
            >
              <View style={styles.feeCardIcon}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color="#7DD3FC"
                />
              </View>

              <Text style={styles.feeLabel}>{item.title}</Text>

              <Text style={styles.feeValue}>{formatCurrency(item.value)}</Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.analyticsGrid,
            isWideScreen && styles.analyticsGridWide,
          ]}
        >
          <View
            style={[
              styles.analyticsColumn,
              isWideScreen && styles.analyticsColumnWide,
            ]}
          >
            <PieChartCard
              title="Students by Class"
              items={analytics.classes}
              emptyText="No class data available."
            />
          </View>

          <View
            style={[
              styles.analyticsColumn,
              isWideScreen && styles.analyticsColumnWide,
            ]}
          >
            <PieChartCard
              title="Students by Subject"
              items={analytics.subjects}
              emptyText="No subject data available."
            />
          </View>
        </View>

        <FinancialSummary items={analytics.financialSummary} />
      </ScrollView>
    </View>
  );
}
