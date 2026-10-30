import React, { useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { RiveAdapterProps } from '../types/adapters';

export const RiveMotionAdapter: React.FC<RiveAdapterProps> = ({
  riveFileUrl,
  stateMachineName,
  inputName,
  frame = 0,
  fps = 60,
  className,
  style,
}) => {
  const { rive, RiveComponent } = useRive({
    src: riveFileUrl,
    stateMachines: stateMachineName,
    autoplay: false,
  });

  const progressInput = useStateMachineInput(rive, stateMachineName, inputName);

  useEffect(() => {
    if (progressInput) {
      progressInput.value = (frame / fps) * 100;
    }
  }, [frame, fps, progressInput]);

  return <RiveComponent className={className} style={{ width: '100%', height: '100%', ...style }} />;
};
