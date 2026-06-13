/**
 * 简易内存限流器
 * 限制每个 IP 在指定时间窗口内的请求次数
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/** 默认：每个 IP 每小时最多 30 次请求 */
const DEFAULT_MAX_REQUESTS = 30;
const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 1 小时

/** 每个 IP 每天最多完成 5 次完整会话（生成报告） */
const REPORT_MAX_PER_DAY = 5;
const REPORT_WINDOW_MS = 24 * 60 * 60 * 1000;

/** 清理过期条目（每 5 分钟触发一次） */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(
  ip: string,
  options?: {
    maxRequests?: number;
    windowMs?: number;
  }
): RateLimitResult {
  const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();
  const key = `${ip}:${maxRequests}:${windowMs}`;

  const entry = store.get(key);

  // 无记录或已过期 → 新建
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetInSeconds: windowMs / 1000 };
  }

  // 超过限制
  if (entry.count >= maxRequests) {
    const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetInSeconds: Math.ceil((entry.resetAt - now) / 1000),
  };
}

/** 报告生成专用限流（更严格） */
export function checkReportLimit(ip: string): RateLimitResult {
  return checkRateLimit(ip, {
    maxRequests: REPORT_MAX_PER_DAY,
    windowMs: REPORT_WINDOW_MS,
  });
}
