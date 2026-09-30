import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

const NotFound = () => {
  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <EmptyState
        icon={<SearchX size={28} />}
        title="Page not found"
        description="The page you are looking for does not exist"
        action={
          <Link to="/">
            <Button>Go home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
