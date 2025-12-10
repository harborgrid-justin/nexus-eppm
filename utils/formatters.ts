// 1. Standard Currency ($1,234.56)
export const formatCurrency = (amount: number): string => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// 2. Compact Currency ($1.2M, $500k)
export const formatCompactCurrency = (amount: number): string => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(amount);

// 3. Parse Currency Input
export const parseCurrency = (input: string): number => 
  parseFloat(input.replace(/[^0-9.-]+/g, '')) || 0;

// 4. Percentage (50.5%)
export const formatPercentage = (value: number, decimals = 0): string => 
  `${value.toFixed(decimals)}%`;

// 5. Standard Date (Oct 24, 2024)
export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '-';
  const d = new Date(date);
  // Adjust for timezone offset to prevent off-by-one day errors
  const userTimezoneOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() + userTimezoneOffset).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// 6. Short Date (10/24)
export const formatShortDate = (date: string | Date | undefined): string => {
  if (!date) return '-';
  const d = new Date(date);
  const userTimezoneOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() + userTimezoneOffset).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
};

// 7. Date Time (Oct 24, 2024, 10:00 AM)
export const formatDateTime = (date: string | Date | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// 8. Duration Label (5 days)
export const formatDuration = (days: number): string => 
  `${days} day${days !== 1 ? 's' : ''}`;

// 9. Work Hours (40 hrs)
export const formatWorkHours = (hours: number): string => 
  `${hours} hr${hours !== 1 ? 's' : ''}`;

// 10. Days Remaining
export const getDaysRemaining = (endDate: string | Date): number => {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
};

// 11. Check Overdue
export const isOverdue = (endDate: string | Date): boolean => 
  getDaysRemaining(endDate) < 0;

// 12. Initials (Sarah Chen -> SC)
export const formatInitials = (name: string): string => 
  name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

// 13. Health Color Classes
export const getHealthColorClass = (health: string): string => {
  switch(health?.toLowerCase()) {
    case 'good': return 'bg-green-100 text-green-800 border-green-200';
    case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

// 14. Priority Text Color
export const getPriorityColorClass = (priority: string): string => {
  switch(priority?.toLowerCase()) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-blue-500';
    default: return 'text-slate-500';
  }
};

// 15. Truncate Text
export const truncateText = (text: string, length: number): string => 
  text.length > length ? text.substring(0, length) + '...' : text;

// 16. Capitalize First
export const capitalize = (text: string): string => 
  text.charAt(0).toUpperCase() + text.slice(1);

// 17. Title Case
export const toTitleCase = (text: string): string => 
  text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// 18. File Size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 19. Integer Format
export const formatInteger = (num: number): string => 
  Math.round(num).toLocaleString('en-US');

// 20. Decimal Format
export const formatDecimal = (num: number, places = 2): string => 
  num.toLocaleString('en-US', { minimumFractionDigits: places, maximumFractionDigits: places });

// 21. Clamp Value
export const clamp = (val: number, min: number, max: number): number => 
  Math.min(Math.max(val, min), max);

// 22. Safe Division
export const safeDivide = (num: number, den: number): number => 
  den === 0 ? 0 : num / den;

// 23. Join List
export const formatList = (items: string[]): string => 
  items.join(', ');

// 24. Normalize WBS Code
export const normalizeWbsCode = (code: string): string => 
  code.trim().toUpperCase();

// 25. Risk Score Format
export const formatRiskScore = (score: number): string => 
  `${score} / 25`;

// 26. Phone Format
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  return phone;
};

// 27. Generate ID
export const generateId = (prefix = 'ID'): string => 
  `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

// 28. Slugify
export const slugify = (text: string): string => 
  text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

// 29. Validate Email
export const isValidEmail = (email: string): boolean => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
