import React from 'react'
import { useThemeStore } from '../store/useThemeStore.js';
import { PaletteIcon } from 'lucide-react';
import { THEMES } from '../constants/index.js';

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();


  return (
    <div className='dropdown dropdown-end'>
      {/* Dropdown Trigger */}
      <button tabIndex={0} className='btn btn-ghost btn-circle'>
        <PaletteIcon className='w-6 h-6' />
      </button>

      <div className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto'>
        <div className='space-y-1'>
          {THEMES.map((themeOption) => (
            <button key={themeOption.name}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                theme === themeOption.name? "bg-primary/10 text-primary" : "hover:bg-base-content/5"
              }`}
              onClick={() => setTheme(themeOption.name)}
            >
              <PaletteIcon className='w-5 h-5' />
              <span className='text-sm font-medium'>{themeOption.label}</span>
              {/* Theme Preview colors */}
              <div className='ml-auto flex gap-1'>
                {themeOption.colors.map((color, index) => (
                  <span key={index} className='size-2 rounded-full' style={{ backgroundColor: color}}></span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector