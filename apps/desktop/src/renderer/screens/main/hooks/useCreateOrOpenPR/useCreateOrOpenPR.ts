import { toast } from "@superset/ui/sonner";
import { useCallback } from "react";
import { electronTrpc } from "renderer/lib/electron-trpc";

interface UseCreateOrOpenPROptions {
	worktreePath?: string;
	onSuccess?: () => void;
}

interface UseCreateOrOpenPRResult {
	createOrOpenPR: () => void;
	isPending: boolean;
}

export function useCreateOrOpenPR({
	worktreePath,
	onSuccess,
}: UseCreateOrOpenPROptions): UseCreateOrOpenPRResult {
	const mutation = electronTrpc.changes.createPR.useMutation({
		onSuccess: () => {
			toast.success("Opening GitHub...");
			onSuccess?.();
		},
		onError: (error) => toast.error(`Failed: ${error.message}`),
	});

	const createOrOpenPR = useCallback(() => {
		if (!worktreePath) return;
		mutation.mutate({ worktreePath });
	}, [mutation, worktreePath]);

	return {
		createOrOpenPR,
		isPending: mutation.isPending,
	};
}
