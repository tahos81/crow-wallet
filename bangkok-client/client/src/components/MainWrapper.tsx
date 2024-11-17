import Background from "../assets/bg.png";
import BackgroundBlur from "../assets/bg-blur.png";

export function MainWrapper({
  children,
  blur = false,
}: {
  children: React.ReactNode;
  blur?: boolean;
}) {
  return (
    <div className="bg-[#0B192C] min-h-screen pt-4 pb-4">
      <div
        className="w-full sm:max-w-[400px] h-[calc(100vh-32px)] overflow-auto bg-cover bg-no-repeat ml-auto mr-auto flex flex-col pl-4 pr-4 rounded-xl border-2 border-white/50"
        style={{
          backgroundImage: `url(${blur ? BackgroundBlur : Background})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
