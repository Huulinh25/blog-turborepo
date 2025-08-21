import { Skeleton } from "@/components/ui/skeleton";

const CommentCardSkeleton = () => {
    return (
        <div>
            <div className="flex items-center gap-2">
                <Skeleton className="rounded-full w-12 h-12" />
                <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="h-8 w-96" />
        </div>
    );
}

export default CommentCardSkeleton;