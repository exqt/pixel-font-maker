import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { AppStateContext, EditorStateContext } from '../contexts';
import ProjectSettingModal from './modals/ProjectSettingModal';
import ActionsModal from './modals/ActionsModal';
import FontPreviewModal from './modals/FontPreviewModal';
import ExportModal from './modals/ExportModal';
import opentype from 'opentype.js';

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 28px;
  background: #333;
  border-bottom: 1px solid #555;
  user-select: none;
  position: relative;
  z-index: 100;
`;

const MenuButton = styled.div<{ $active?: boolean }>`
  padding: 0 10px;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #ddd;
  cursor: default;
  background: ${(p) => (p.$active ? '#0066cc' : 'transparent')};

  &:hover {
    background: ${(p) => (p.$active ? '#0066cc' : '#444')};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 28px;
  left: 0;
  background: #2a2a2a;
  border: 1px solid #555;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  min-width: 220px;
  padding: 4px 0;
  z-index: 200;
`;

const Item = styled.div<{ $disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 20px;
  font-size: 13px;
  color: ${(p) => (p.$disabled ? '#666' : '#ddd')};
  cursor: ${(p) => (p.$disabled ? 'default' : 'default')};

  &:hover {
    background: ${(p) => (p.$disabled ? 'transparent' : '#0066cc')};
    color: ${(p) => (p.$disabled ? '#666' : '#fff')};
  }
`;

const Shortcut = styled.span`
  color: #888;
  margin-left: 24px;
  font-size: 12px;
`;

const Separator = styled.div`
  height: 1px;
  background: #555;
  margin: 4px 0;
`;

const SubMenuWrapper = styled.div`
  position: relative;

  &:hover > div {
    display: block;
  }
`;

const SubMenuDropdown = styled.div`
  display: none;
  position: absolute;
  left: 100%;
  top: -4px;
  background: #2a2a2a;
  border: 1px solid #555;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  min-width: 180px;
  padding: 4px 0;
`;

const SubMenuTrigger = styled(Item)`
  &::after {
    content: '▸';
    margin-left: 12px;
    color: #888;
  }
`;

interface MenuItemDef {
  type?: 'separator';
  label?: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  submenu?: MenuItemDef[];
}

interface MenuDef {
  label: string;
  items: MenuItemDef[];
}

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const cmdKey = isMac ? '⌘' : 'Ctrl+';
const shiftKey = isMac ? '⇧' : 'Shift+';

const MenuDropdown: React.FC<{ items: MenuItemDef[]; onClose: () => void }> = ({ items, onClose }) => (
  <Dropdown>
    {items.map((item, i) => {
      if (item.type === 'separator') return <Separator key={i} />;

      if (item.submenu) {
        return (
          <SubMenuWrapper key={i}>
            <SubMenuTrigger>{item.label}</SubMenuTrigger>
            <SubMenuDropdown>
              {item.submenu.map((sub, j) => {
                if (sub.type === 'separator') return <Separator key={j} />;
                return (
                  <Item
                    key={j}
                    $disabled={sub.disabled}
                    onClick={() => {
                      if (!sub.disabled && sub.onClick) {
                        sub.onClick();
                        onClose();
                      }
                    }}
                  >
                    <span>{sub.label}</span>
                    {sub.shortcut && <Shortcut>{sub.shortcut}</Shortcut>}
                  </Item>
                );
              })}
            </SubMenuDropdown>
          </SubMenuWrapper>
        );
      }

      return (
        <Item
          key={i}
          $disabled={item.disabled}
          onClick={() => {
            if (!item.disabled && item.onClick) {
              item.onClick();
              onClose();
            }
          }}
        >
          <span>{item.label}</span>
          {item.shortcut && <Shortcut>{item.shortcut}</Shortcut>}
        </Item>
      );
    })}
  </Dropdown>
);

const AppMenuBar = observer(({ onBack }: { onBack: () => void }) => {
  const appState = useContext(AppStateContext);
  const editorState = useContext(EditorStateContext);
  const project = editorState.project;

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpenMenu(null), []);

  useEffect(() => {
    if (openMenu === null) return;
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu, close]);

  const preview = async () => {
    const result = await project.toTrueTypeFile('ttf');
    const blob = new Blob([result.data], { type: 'font/ttf' });
    const url = URL.createObjectURL(blob);
    appState.setModalContent(<FontPreviewModal url={url} />);
  };

  const loadFont = async () => {
    const result = await window.electronAPI.openFont();
    if (result) {
      try {
        const font = opentype.parse(result.buffer);
        editorState.referenceFont.setFont(font);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const menus: MenuDef[] = [
    {
      label: 'File',
      items: [
        { label: 'Save', shortcut: `${cmdKey}S`, onClick: () => project.save() },
        { label: 'Export...', shortcut: `${cmdKey}E`, onClick: () => appState.setModalContent(<ExportModal project={project} />) },
        { type: 'separator' },
        { label: 'Settings...', onClick: () => appState.setModalContent(<ProjectSettingModal project={project} />) },
        { type: 'separator' },
        { label: 'Back to Main', onClick: onBack },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: `${cmdKey}Z`, onClick: () => editorState.undo() },
        { label: 'Redo', shortcut: `${cmdKey}${shiftKey}Z`, onClick: () => editorState.redo() },
        { type: 'separator' },
        { label: 'Cut', shortcut: `${cmdKey}X`, onClick: () => editorState.cut() },
        { label: 'Copy', shortcut: `${cmdKey}C`, onClick: () => editorState.copy() },
        { label: 'Paste', shortcut: `${cmdKey}V`, onClick: () => editorState.paste() },
        { type: 'separator' },
        { label: 'Clear', onClick: () => editorState.clear() },
        { label: 'Flip Horizontal', onClick: () => editorState.flipH() },
        { label: 'Flip Vertical', onClick: () => editorState.flipV() },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Zoom In', onClick: () => editorState.setZoom(Math.min(editorState.zoom + 1, 2)) },
        { label: 'Zoom Out', onClick: () => editorState.setZoom(Math.max(editorState.zoom - 1, 0)) },
        { label: 'Reset Zoom', onClick: () => editorState.setZoom(0) },
      ],
    },
    {
      label: 'Tools',
      items: [
        { label: 'Actions...', onClick: () => appState.setModalContent(<ActionsModal project={project} />) },
        { label: 'Preview', onClick: preview },
        { type: 'separator' },
        {
          label: 'Reference Font',
          submenu: [
            { label: 'Toggle', onClick: () => editorState.referenceFont.setEnable(!editorState.referenceFont.enable) },
            {
              label: 'Reset Offset',
              onClick: () => {
                editorState.referenceFont.setOffset(0, 0);
                editorState.referenceFont.setScale(256);
              },
            },
            { label: 'Load Font...', onClick: loadFont },
          ],
        },
      ],
    },
  ];

  return (
    <Bar ref={barRef}>
      {menus.map((menu, idx) => (
        <div key={menu.label} style={{ position: 'relative' }}>
          <MenuButton
            $active={openMenu === idx}
            onMouseDown={() => setOpenMenu(openMenu === idx ? null : idx)}
            onMouseEnter={() => {
              if (openMenu !== null) setOpenMenu(idx);
            }}
          >
            {menu.label}
          </MenuButton>
          {openMenu === idx && <MenuDropdown items={menu.items} onClose={close} />}
        </div>
      ))}
    </Bar>
  );
});

export default AppMenuBar;
