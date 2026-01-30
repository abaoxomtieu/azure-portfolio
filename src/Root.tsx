import { Composition } from "remotion";
import { AppDemo } from "./remotion/AppDemo";

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="AppDemo"
				component={AppDemo}
				durationInFrames={1050}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{}}
			/>
		</>
	);
};
