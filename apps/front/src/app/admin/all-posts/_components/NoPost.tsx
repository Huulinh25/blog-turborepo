import { Button } from "@/components/ui/button";

const NoPost = () => {
  return (
    <div className="mt-32 flex flex-col items-center gap-5">
      <p className="text-center p-4 text-5xl text-slate-400">No Posts Yet!</p>
      <Button variant="outline" disabled>
        No action available
      </Button>
    </div>
  );
};

export default NoPost;