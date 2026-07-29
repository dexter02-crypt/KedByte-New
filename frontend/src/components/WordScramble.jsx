import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import useMediaQuery from "@/hooks/use-media-query";

/**
 * WordScramble - Interactive letter grid where users discover hidden words on hover
 * Inspired by interactive word search grids
 */

const WORDS_TO_FIND = [
  { word: "SOFTWARE", row: 2, col: 0, direction: "horizontal", label: "Custom Software" },
  { word: "AIAUTOMATION", row: 4, col: 2, direction: "horizontal", label: "AI Automation" },
  { word: "CLOUD", row: 6, col: 5, direction: "vertical", label: "Cloud Infrastructure" },
  { word: "DEVOPS", row: 8, col: 8, direction: "horizontal", label: "DevOps" },
  { word: "MACHINE", row: 3, col: 3, direction: "diagonal", label: "Machine Learning" },
  { word: "WEBAPP", row: 5, col: 1, direction: "vertical", label: "Web Applications" },
];

const GRID_ROWS = 12;
const GRID_COLS = 16;

// Every cell that belongs to a hidden service word, for hover-trace hinting
const cellsOfWord = ({ word, row, col, direction }) => {
  const cells = [];
  for (let i = 0; i < word.length; i++) {
    let r = row, c = col;
    if (direction === "horizontal") c += i;
    else if (direction === "vertical") r += i;
    else if (direction === "diagonal") { r += i; c += i; }
    cells.push(`${r}-${c}`);
  }
  return cells;
};
const WORD_CELLS = new Set(WORDS_TO_FIND.flatMap(cellsOfWord));

function generateRandomLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

function generateGrid(words) {
  // Create empty grid
  const grid = Array(GRID_ROWS).fill(null).map(() => 
    Array(GRID_COLS).fill(null).map(() => generateRandomLetter())
  );

  // Place words in grid
  words.forEach(({ word, row, col, direction }) => {
    for (let i = 0; i < word.length; i++) {
      let r = row, c = col;
      
      if (direction === "horizontal") c += i;
      else if (direction === "vertical") r += i;
      else if (direction === "diagonal") { r += i; c += i; }
      
      if (r < GRID_ROWS && c < GRID_COLS) {
        grid[r][c] = word[i];
      }
    }
  });

  return grid;
}

export default function WordScramble({ className = "" }) {
  // Touch judgment call: hover-tracing is meaningless on phones and the
  // 700px grid would need horizontal panning. Below md the section shows
  // the capabilities directly as a clean revealed chip list.
  const mobile = useMediaQuery("(max-width: 767px)");
  const [grid] = useState(() => generateGrid(WORDS_TO_FIND));
  const [hoveredCells, setHoveredCells] = useState(new Set());
  const [foundWords, setFoundWords] = useState(new Set());
  // Cells of already-found words stay lit cyan permanently
  const [foundCells, setFoundCells] = useState(new Set());
  const [currentWord, setCurrentWord] = useState(null);
  const gridRef = useRef(null);

  const getCellKey = (row, col) => `${row}-${col}`;

  const checkWord = useCallback((cells) => {
    for (const wordData of WORDS_TO_FIND) {
      const wordCells = cellsOfWord(wordData);
      const allCellsHovered = wordCells.every(cell => cells.has(cell));
      if (allCellsHovered && !foundWords.has(wordData.word)) {
        setFoundWords(prev => new Set([...prev, wordData.word]));
        setFoundCells(prev => new Set([...prev, ...wordCells]));
        setCurrentWord(wordData);
        return wordData;
      }
    }
    return null;
  }, [foundWords]);

  const handleCellHover = (row, col) => {
    const key = getCellKey(row, col);
    setHoveredCells(prev => {
      const newSet = new Set([...prev, key]);
      checkWord(newSet);
      return newSet;
    });
  };

  const handleMouseLeave = () => {
    setHoveredCells(new Set());
    setCurrentWord(null);
  };

  const isCellInWord = (row, col, wordData) => {
    if (!wordData) return false;
    const { word, row: startRow, col: startCol, direction } = wordData;
    
    for (let i = 0; i < word.length; i++) {
      let r = startRow, c = startCol;
      if (direction === "horizontal") c += i;
      else if (direction === "vertical") r += i;
      else if (direction === "diagonal") { r += i; c += i; }
      
      if (r === row && c === col) return true;
    }
    return false;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-accent mb-4">
          Discover Our Capabilities
        </p>
        <h3 className="font-heading text-3xl md:text-4xl font-bold text-white">
          Hover to reveal our services
        </h3>
        {currentWord && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-accent/10 border border-cyan-accent/30"
          >
            <span className="text-cyan-accent font-medium">{currentWord.label}</span>
          </motion.div>
        )}
      </motion.div>

      {mobile ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2"
          data-testid="scramble-mobile-chips"
        >
          {WORDS_TO_FIND.map(({ word, label }, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-full border border-cyan-accent/40 bg-cyan-accent/5 px-4 py-2 text-sm text-cyan-accent"
            >
              {label}
            </motion.span>
          ))}
        </motion.div>
      ) : (
      <>
      {/* Grid — flex justify-center actually centers the inline-flex block
          (mx-auto alone never centered it: inline-level boxes ignore auto
          margins, which left the grid hugging the left half) */}
      <motion.div
        ref={gridRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        onMouseLeave={handleMouseLeave}
        className="relative flex overflow-x-auto pb-4 [justify-content:safe_center]"
      >
        <div className="inline-flex flex-col gap-1 min-w-max">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((letter, colIndex) => {
                const key = getCellKey(rowIndex, colIndex);
                const isHovered = hoveredCells.has(key);
                const isInCurrentWord = currentWord && isCellInWord(rowIndex, colIndex, currentWord);
                const isFoundCell = foundCells.has(key);
                const isWordCell = WORD_CELLS.has(key);

                return (
                  <motion.div
                    key={key}
                    onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`
                      relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center
                      font-mono text-xs font-bold cursor-crosshair
                      transition-all duration-300 rounded
                      ${isInCurrentWord
                        ? 'bg-cyan-accent/20 text-cyan-accent border border-cyan-accent shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                        : isFoundCell
                        ? 'bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/50 shadow-[0_0_6px_rgba(0,240,255,0.25)]'
                        : isHovered && isWordCell
                        ? 'bg-cyan-accent/10 text-cyan-accent/90 border border-cyan-accent/40'
                        : isHovered
                        ? 'bg-white/10 text-white border-white/20 border'
                        : 'bg-white/[0.03] text-zinc-600 border border-white/5'
                      }
                    `}
                  >
                    {letter}
                    {isInCurrentWord && (
                      <motion.div
                        layoutId={`word-${currentWord.word}`}
                        className="absolute inset-0 bg-cyan-accent/10 rounded"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Found Words */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 flex flex-wrap gap-2 justify-center"
      >
        {WORDS_TO_FIND.map(({ word, label }) => {
          const found = foundWords.has(word);
          return (
            <motion.div
              key={`${word}-${found}`}
              // Remount on found so the pop spring replays
              initial={found ? { scale: 0.7 } : false}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 14 }}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium border
                ${found
                  ? 'bg-cyan-accent/10 text-cyan-accent border-cyan-accent/50 shadow-[0_0_14px_rgba(0,240,255,0.25)]'
                  : 'bg-white/5 text-zinc-400 border-white/15'
                }
              `}
            >
              {label}
            </motion.div>
          );
        })}
      </motion.div>
      </>
      )}
    </div>
  );
}
