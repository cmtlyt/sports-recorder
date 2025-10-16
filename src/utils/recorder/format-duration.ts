function padStart(value: number | string, length: number, fillChar = '0') {
  return String(value).padStart(length, fillChar);
}

/** 格式化时间显示 */
export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours === 0) {
    return `${padStart(minutes, 2, '0')}:${padStart(secs, 2, '0')}`;
  }

  return `${padStart(hours, 2, '0')}:${padStart(minutes, 2, '0')}:${padStart(secs, 2, '0')}`;
}
