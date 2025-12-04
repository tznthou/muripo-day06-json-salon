/**
 * JSON 美容院 - JSON Salon
 * 讓您的 JSON 煥然一新
 */

// DOM Elements
const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const sortKeysEl = document.getElementById('sortKeys');
const indentEl = document.getElementById('indent');
const clearBtn = document.getElementById('clearBtn');
const pasteBtn = document.getElementById('pasteBtn');
const copyBtn = document.getElementById('copyBtn');
const statusEl = document.getElementById('status');
const achievementEl = document.getElementById('achievement');
const inputCountEl = document.getElementById('inputCount');
const outputCountEl = document.getElementById('outputCount');

// 成就追蹤
let achievements = {
  firstBeautify: false,
  fixedError: false,
  bigJson: false,
  mcpMaster: false
};

// 旁白台詞
const quotes = {
  success: [
    '您的 JSON 洗好囉！煥然一新~',
    '完美！這 JSON 現在閃閃發亮',
    '漂亮！連括號都在微笑',
    'JSON 美容完成，請慢走~',
    '整理得乾乾淨淨，舒服！'
  ],
  error: [
    '這位客人，您的 JSON 有點狀況...',
    '哎呀，這 JSON 需要急救！',
    '語法錯誤偵測到，來看看哪裡出問題',
    'JSON 受傷了，讓我們找出傷口'
  ],
  empty: [
    '請貼上您的 JSON，我來幫您整理',
    '等待中... 隨時準備服務您的 JSON'
  ],
  copied: [
    '已複製！去貼上吧',
    '複製成功！JSON 已在剪貼簿待命',
    'Ctrl+V 的時候到了！'
  ]
};

// 隨機選擇台詞
function randomQuote(category) {
  const list = quotes[category];
  return list[Math.floor(Math.random() * list.length)];
}

// 遞迴排序 Object keys
function sortObjectKeys(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  const sorted = {};
  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));

  for (const key of keys) {
    sorted[key] = sortObjectKeys(obj[key]);
  }

  return sorted;
}

// 取得縮排字串
function getIndent() {
  const value = indentEl.value;
  if (value === 'tab') return '\t';
  return parseInt(value, 10);
}

// 解析錯誤位置
function parseErrorPosition(errorMessage) {
  // JSON.parse 錯誤格式："... at position 123"
  const posMatch = errorMessage.match(/position\s+(\d+)/i);
  if (posMatch) {
    return parseInt(posMatch[1], 10);
  }

  // 有些瀏覽器的格式："... at line X column Y"
  const lineMatch = errorMessage.match(/line\s+(\d+)/i);
  const colMatch = errorMessage.match(/column\s+(\d+)/i);
  if (lineMatch) {
    return { line: parseInt(lineMatch[1], 10), column: colMatch ? parseInt(colMatch[1], 10) : 1 };
  }

  return null;
}

// 從位置計算行列
function positionToLineCol(text, position) {
  const lines = text.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}

// 猜測錯誤原因
function guessErrorCause(text, position) {
  if (position === null) return '';

  const pos = typeof position === 'number' ? position : 0;
  const around = text.substring(Math.max(0, pos - 20), pos + 20);

  // 常見錯誤模式
  if (/,\s*[}\]]/.test(around)) {
    return '可能是多了一個逗號（trailing comma）';
  }
  if (/["\w]\s*["\w{[]/.test(around)) {
    return '可能是少了逗號';
  }
  if (/:\s*[,}\]]/.test(around)) {
    return '可能是值漏掉了';
  }
  if (/['"]/.test(around) && !/["]/.test(around)) {
    return '請使用雙引號（"）而非單引號（\'）';
  }

  return '';
}

// 美化 JSON
function beautifyJson(input) {
  const trimmed = input.trim();

  if (!trimmed) {
    return { success: false, result: '', isEmpty: true };
  }

  try {
    let parsed = JSON.parse(trimmed);

    // 排序 keys
    if (sortKeysEl.checked) {
      parsed = sortObjectKeys(parsed);
    }

    // 美化輸出
    const indent = getIndent();
    const result = JSON.stringify(parsed, null, indent);

    return { success: true, result, parsed };
  } catch (error) {
    const position = parseErrorPosition(error.message);
    let errorInfo = error.message;

    if (position !== null) {
      const lineCol = typeof position === 'number'
        ? positionToLineCol(trimmed, position)
        : position;

      errorInfo = `第 ${lineCol.line} 行，第 ${lineCol.column} 字元附近有問題`;

      const guess = guessErrorCause(trimmed, typeof position === 'number' ? position : 0);
      if (guess) {
        errorInfo += `\n${guess}`;
      }
    }

    return { success: false, result: errorInfo, isError: true };
  }
}

// 更新字元計數
function updateCharCount() {
  inputCountEl.textContent = `${inputEl.value.length} 字元`;
  outputCountEl.textContent = `${outputEl.value.length} 字元`;
}

// 顯示狀態訊息
function showStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
}

// 顯示成就
function showAchievement(text) {
  achievementEl.textContent = text;
  achievementEl.style.display = 'block';

  // 5 秒後隱藏
  setTimeout(() => {
    achievementEl.style.display = 'none';
  }, 5000);
}

// 檢查並觸發成就
function checkAchievements(result) {
  if (result.success && !achievements.firstBeautify) {
    achievements.firstBeautify = true;
    showAchievement('Achievement Unlocked: 美容初體驗');
    return;
  }

  if (result.success && inputEl.value.length > 5000 && !achievements.bigJson) {
    achievements.bigJson = true;
    showAchievement('Achievement Unlocked: JSON 巨獸馴服師');
    return;
  }

  // 檢查是否是 MCP 設定
  if (result.success && result.parsed) {
    const json = result.parsed;
    if ((json.mcpServers || json.servers) && !achievements.mcpMaster) {
      achievements.mcpMaster = true;
      showAchievement('Achievement Unlocked: MCP 設定大師');
      return;
    }
  }
}

// 處理輸入變化
function handleInput() {
  const result = beautifyJson(inputEl.value);

  if (result.isEmpty) {
    outputEl.value = '';
    outputEl.classList.remove('has-error');
    showStatus(randomQuote('empty'), 'info');
  } else if (result.success) {
    outputEl.value = result.result;
    outputEl.classList.remove('has-error');
    showStatus(randomQuote('success'), 'success');
    checkAchievements(result);
  } else {
    outputEl.value = result.result;
    outputEl.classList.add('has-error');
    showStatus(randomQuote('error'), 'error');
  }

  updateCharCount();
}

// 清空
function handleClear() {
  inputEl.value = '';
  outputEl.value = '';
  outputEl.classList.remove('has-error');
  showStatus(randomQuote('empty'), 'info');
  updateCharCount();
  inputEl.focus();
}

// 貼上剪貼簿
async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText();
    inputEl.value = text;
    handleInput();
    inputEl.focus();
  } catch (err) {
    showStatus('無法讀取剪貼簿，請手動貼上', 'error');
  }
}

// 複製結果
async function handleCopy() {
  if (!outputEl.value || outputEl.classList.contains('has-error')) {
    showStatus('沒有可複製的內容', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(outputEl.value);
    showStatus(randomQuote('copied'), 'success');

    // 按鈕動畫
    copyBtn.textContent = '已複製 ✓';
    setTimeout(() => {
      copyBtn.textContent = '複製結果';
    }, 2000);
  } catch (err) {
    showStatus('複製失敗，請手動選取複製', 'error');
  }
}

// Event Listeners
inputEl.addEventListener('input', handleInput);
sortKeysEl.addEventListener('change', handleInput);
indentEl.addEventListener('change', handleInput);
clearBtn.addEventListener('click', handleClear);
pasteBtn.addEventListener('click', handlePaste);
copyBtn.addEventListener('click', handleCopy);

// 快捷鍵
document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + Enter = 複製結果
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    handleCopy();
  }

  // Cmd/Ctrl + Shift + V = 貼上並處理
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'v') {
    e.preventDefault();
    handlePaste();
  }
});

// 初始化
updateCharCount();
showStatus(randomQuote('empty'), 'info');

// 歡迎訊息
console.log('%c JSON 美容院 ', 'background: #89b4fa; color: #1e1e2e; font-size: 16px; padding: 4px 8px; border-radius: 4px;');
console.log('歡迎光臨！讓您的 JSON 煥然一新 ✨');
console.log('快捷鍵：Cmd/Ctrl + Enter = 複製結果');
