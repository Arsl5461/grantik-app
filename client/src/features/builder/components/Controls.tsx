import { useModelStore } from '../../../stores/models';
import { OrbitControls, TransformControls } from "@react-three/drei";

const Controls = () => {
    const modes = ["translate", "rotate", "scale"];

    const { target, mode } = useModelStore();
    return (
      <>
        {target && <TransformControls object={target} mode={modes[mode]} />}
        <OrbitControls makeDefault zoomSpeed={0.75} maxPolarAngle={Math.PI / 2.55} />
      </>
    );
  }

export default Controls