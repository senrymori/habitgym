import { FC, PropsWithChildren, useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { View } from 'react-native';

interface Props extends PropsWithChildren {
  expanded: boolean;
}

export const Collapsible: FC<Props> = function (props) {
  const [height, setHeight] = useState(0);
  const animHeight = useSharedValue(0);

  useEffect(() => {
    animHeight.value = withTiming(props.expanded ? height : 0, { duration: 300 });
  }, [props.expanded, height]);

  const style = useAnimatedStyle(() => ({
    height: animHeight.value,
    overflow: 'hidden',
  }));

  return (
    <Animated.View style={style}>
      <View
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        style={{ position: 'absolute', width: '100%' }}>
        {props.children}
      </View>
    </Animated.View>
  );
};
