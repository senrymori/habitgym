import { FC, useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { FieldArrayWithId, UseFieldArrayReturn } from 'react-hook-form';
import { NestableDraggableFlatList, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { sharedLayoutStyles } from '@ui-kits/shared-styles';
import { ProgramFormValues } from '../gym-program-detail-types';
import { ExerciseSetupCard } from './ExerciseSetupCard';

type ExerciseFieldItem = FieldArrayWithId<ProgramFormValues, 'exercises', 'fieldKey'>;

interface ProgramExerciseSetupListProps {
  exercisesFieldArray: UseFieldArrayReturn<ProgramFormValues, 'exercises', 'fieldKey'>;
}

export const ProgramExerciseSetupList: FC<ProgramExerciseSetupListProps> = function (props) {
  const fieldArrayRef = useRef(props.exercisesFieldArray);
  useEffect(() => {
    fieldArrayRef.current = props.exercisesFieldArray;
  }, [props.exercisesFieldArray]);

  const handleDragEnd = useCallback(({ from, to }: { from: number; to: number }) => {
    if (from !== to) fieldArrayRef.current.move(from, to);
  }, []);

  const renderItem = useCallback(({ item, getIndex, drag, isActive }: RenderItemParams<ExerciseFieldItem>) => {
    const index = getIndex() ?? 0;
    return (
      <ScaleDecorator>
        <View style={sharedLayoutStyles.pb8}>
          <ExerciseSetupCard
            item={item}
            index={index}
            drag={drag}
            isActive={isActive}
          />
        </View>
      </ScaleDecorator>
    );
  }, []);

  return (
    <NestableDraggableFlatList
      data={props.exercisesFieldArray.fields}
      keyExtractor={(item) => item.fieldKey}
      renderItem={renderItem}
      onDragEnd={handleDragEnd}
      activationDistance={10}
    />
  );
};
