import { useMemo, useCallback } from 'react';
import type { Member, Match } from '../types';
import { getActiveMemberIds } from '../utils/memberActivity';

/**
 * Hook to compute active member status based on last 10 matches participation.
 * A member is "active" if they played in at least one of the last 10 matches.
 */
export function useMemberActivity(members: Member[], matches: Match[]) {
  const activeMemberIds = useMemo(
    () => getActiveMemberIds(matches, 10),
    [matches]
  );

  const activeMembers = useMemo(
    () => members.filter(m => activeMemberIds.has(m.id)),
    [members, activeMemberIds]
  );

  const isActive = useCallback(
    (memberId: string) => activeMemberIds.has(memberId),
    [activeMemberIds]
  );

  const activeCount = useMemo(
    () => activeMembers.length,
    [activeMembers]
  );

  return { activeMemberIds, activeMembers, activeCount, isActive };
}
