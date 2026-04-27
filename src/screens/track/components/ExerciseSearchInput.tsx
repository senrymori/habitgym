import { FC, useCallback, useState } from 'react';
import { InputText } from '@ui-kits/inputs/InputText';
import { useLanguage } from '@providers/language/LanguageProvider';
import { useDebounce } from '@utils/hooks/useDebounce';

interface ExerciseSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ExerciseSearchInput: FC<ExerciseSearchInputProps> = function (props) {
  const { translations } = useLanguage();
  const [text, setText] = useState(props.value);
  const [debouncedOnChange] = useDebounce(props.onChange, 300);

  const handleChange = useCallback(
    (next: string) => {
      setText(next);
      debouncedOnChange(next);
    },
    [debouncedOnChange]
  );

  return (
    <InputText
      value={text}
      onChangeText={handleChange}
      placeholder={translations.track.exercise.search}
    />
  );
};
