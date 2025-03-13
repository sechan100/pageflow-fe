import { useNextRouter } from "@/shared/hooks/useNextRouter";

export const BarLogo = () => {
  const { router } = useNextRouter();

  return (
    <div
      style={{
        width: 100,
        marginLeft: 20,
        color: 'black',
        cursor: 'pointer',
      }}
      onClick={() => router.push('/')}
    >
      Pageflow
    </div>
  );
}