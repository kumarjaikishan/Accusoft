import { useSelector } from "react-redux";
import { useMemo } from "react";

// 🔥 Main hook (use this in components)
export const useTableStyles = () => {
  const mode = useSelector((state) => state.theme?.mode);

  const styles = useMemo(() => {
    return getCustomDataTableStyles(mode);
  }, [mode]);

  return styles;
};

// 🔥 Internal style generator (NOT exported)
const getCustomDataTableStyles = (mode) => ({
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
      backgroundColor: mode === 'dark' ? '#0f172a' : '#1e293b',
      color: '#ffffff',
      minHeight: '48px',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },
  },
  headCells: {
    style: {
      fontWeight: '700',
      fontSize: '14px',
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
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
    },
  },
});