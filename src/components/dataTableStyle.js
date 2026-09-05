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

// 🔥 Internal style generator
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
      minHeight: '38px',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
    },
  },
  headCells: {
    style: {
      fontWeight: '700',
      fontSize: '11px',
      paddingLeft: '10px',
      paddingRight: '10px',
      firstCellPaddingLeft: '18px',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    },
  },
  rows: {
    style: {
      backgroundColor: 'transparent',
      color: mode === 'dark' ? '#f1f5f9' : '#334155',
      minHeight: '48px',
      '&:not(:last-child)': {
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    },
  },
  pagination: {
    style: {
      backgroundColor: 'transparent',
      color: mode === 'dark' ? '#94a3b8' : '#64748b',
      borderTop: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
      marginTop: '0px',
      fontSize: '12px',
    },
  },
  cells: {
    style: {
      paddingLeft: '10px',
      paddingRight: '10px',
      firstCellPaddingLeft: '18px',
    },
  },
});