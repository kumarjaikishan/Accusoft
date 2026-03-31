import { useSelector } from "react-redux";
import { useMemo } from "react";

// 🔥 Main hook (use this in components)
export const useTableStyles = () => {
  const mode = useSelector((state) => state.theme?.mode);
  const mainColor = useSelector((state) => state.theme?.mainColor);

  const styles = useMemo(() => {
    return getCustomDataTableStyles(mode, mainColor);
  }, [mode, mainColor]);

  return styles;
};

// 🔥 Internal style generator (NOT exported)
const getCustomDataTableStyles = (mode, mainColor) => ({
  table: {
    style: {
      backgroundColor: 'transparent',
    },
  },
  header: {
    style: {
      display: 'none',
    },
  },
  headRow: {
    style: {
      backgroundColor: mainColor || (mode === 'dark' ? '#0f172a' : '#1e293b'),
      color: '#ffffff',
      minHeight: '48px',
      borderTopLeftRadius: '2px',
      borderTopRightRadius: '2px',
    },
  },
  headCells: {
    style: {
      fontWeight: '700',
      fontSize: '14px',
      paddingLeft: '8px',
      paddingRight: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  rows: {
    style: {
      backgroundColor: 'var(--theme-surface)',
      color: 'var(--theme-content)',
      minHeight: '45px',
      '&:not(:last-child)': {
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: 'var(--theme-border)',
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: 'var(--theme-page)',
    },
  },
  pagination: {
    style: {
      backgroundColor: 'var(--theme-surface)',
      color: 'var(--theme-content)',
      borderTop: '1px solid var(--theme-border)',
      marginTop: '0px',
      borderBottomLeftRadius: '2px',
      borderBottomRightRadius: '2px',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
});