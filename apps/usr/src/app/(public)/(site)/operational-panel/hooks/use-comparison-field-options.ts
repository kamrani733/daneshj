'use client';

import { useMemo } from 'react';

import {
  ACADEMIC_GROUP_OPTIONS,
  DEGREE_LEVEL_OPTIONS,
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
  STUDY_STATUS_OPTIONS,
} from '@private-panel/data/field-options';
import { COUNTRY_OPTIONS, citiesForProvince, provincesForCountry } from '@private-panel/data/geo';

import { useComparisonOptions } from '@operational-panel/hooks/use-chart-queries';
import type { ComparisonField, ComparisonFilters, FilterOption } from '@operational-panel/types/charts';

/**
 * Options per comparison field. Profile lists are shared with the private panel (same values the Actor MS
 * stores); universities and majors come from `api/`. Province / city lists follow the chosen country / province.
 */
export function useComparisonFieldOptions(filters: ComparisonFilters): Record<ComparisonField, FilterOption[]> {
  const remote = useComparisonOptions();
  const universities = remote.data?.universities;
  const majors = remote.data?.majors;

  return useMemo(
    () => ({
      gender: GENDER_OPTIONS,
      userType: OCCUPATION_OPTIONS,
      liveCountry: COUNTRY_OPTIONS,
      liveProvince: provincesForCountry(filters.liveCountry ?? ''),
      liveCity: citiesForProvince(filters.liveProvince ?? ''),
      eduCountry: COUNTRY_OPTIONS,
      eduProvince: provincesForCountry(filters.eduCountry ?? ''),
      eduCity: citiesForProvince(filters.eduProvince ?? ''),
      university: universities ?? [],
      studyStatus: STUDY_STATUS_OPTIONS,
      degree: DEGREE_LEVEL_OPTIONS,
      academicGroup: ACADEMIC_GROUP_OPTIONS,
      major: majors ?? [],
    }),
    [filters.eduCountry, filters.eduProvince, filters.liveCountry, filters.liveProvince, majors, universities],
  );
}

/** Changing a country / province clears the fields that depend on it. */
export function withDependentsCleared(filters: ComparisonFilters, field: ComparisonField): ComparisonFilters {
  const next = { ...filters };
  if (field === 'liveCountry') delete next.liveProvince;
  if (field === 'liveCountry' || field === 'liveProvince') delete next.liveCity;
  if (field === 'eduCountry') delete next.eduProvince;
  if (field === 'eduCountry' || field === 'eduProvince') delete next.eduCity;
  return next;
}
