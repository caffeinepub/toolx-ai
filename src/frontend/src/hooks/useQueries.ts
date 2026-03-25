import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plan } from "../backend";
import { useActor } from "./useActor";

export { Plan };

export function useUserPlan() {
  const { actor, isFetching } = useActor();
  return useQuery<Plan>({
    queryKey: ["userPlan"],
    queryFn: async () => {
      if (!actor) return Plan.free;
      return actor.getUserPlan(null);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCanUseBackgroundRemover() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["canUseBgRemover"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.canUseBackgroundRemover(null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRemainingUsage() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["remainingUsage"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getRemainingUsage(null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpgradeToPro() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      return actor.upgradeToPro(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPlan"] });
    },
  });
}

export function useIncrementBgRemover() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      return actor.incrementBackgroundRemoverUsage(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["remainingUsage"] });
      queryClient.invalidateQueries({ queryKey: ["canUseBgRemover"] });
    },
  });
}
