import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Logo } from '@/components/ui/logo';
import { Colors, Layout, Spacing } from '@/theme';

export type AppHeaderProps = {
  label?: string;
};

export function AppHeader({ label }: AppHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.bar}>
        <Logo />
        {label ? (
          <AppText variant="labelMd" color={Colors.onSurfaceVariant}>
            {label}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingTop: Spacing.xs,
  },
  bar: {
    height: Layout.headerHeight,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});