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
    <div className="bg-[#0B192C] min-h-screen">
      <div
        className="w-full sm:max-w-[360px] min-h-screen bg-cover bg-no-repeat ml-auto mr-auto flex flex-col pl-4 pr-4"
        style={{
          backgroundImage: `url(${blur ? BackgroundBlur : Background})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
