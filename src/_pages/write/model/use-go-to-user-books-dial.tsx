import { useWritePageDialMenuStore } from "@/features/book";
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { LogOut } from "lucide-react";
import { useEffect } from "react";




export const useGoToUserBooksDial = () => {
  const { addDialAction } = useWritePageDialMenuStore();
  const { router } = useNextRouter();


  useEffect(() => {
    return addDialAction({
      name: "내 서재로 나가기",
      icon: <LogOut />,
      cb: () => {
        router.push("/user/books");
      }
    }, 10000);
  }, [addDialAction, router]);
};