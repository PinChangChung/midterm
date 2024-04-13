import { DefaultTheme } from '@react-navigation/native';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    light400: '#979797',
    primary700: '#F29D38',
  },
};

export default MyTheme;