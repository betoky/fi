import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

const PrimePreset = definePreset(Lara, {
  components: {
    menubar: {
      root: {
        borderRadius: '4rem',
        padding: '0.35rem 2rem',
        gap: '1rem',
      },
      baseItem: {
        padding: '0.5rem',
      },
      item: {
        gap: '0.625rem',
      },
      separator: {
        borderColor: '{border.color}',
      },
    },
  },
});

export default PrimePreset;
