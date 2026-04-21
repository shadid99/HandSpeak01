# إعداد المصادقة (Authentication)

## نظرة عامة

يستخدم التطبيق Supabase للمصادقة عبر البريد الإلكتروني وكلمة المرور. تم إعداد كل شيء تلقائياً!

## المتطلبات المنفذة

✅ تسجيل دخول (Sign In)
✅ إنشاء حساب (Sign Up)
✅ تسجيل خروج (Sign Out)
✅ إدارة جلسة المستخدم تلقائياً
✅ حماية الشاشات بناءً على حالة المصادقة

## البنية

### 1. Supabase Client (`src/services/supabase.ts`)
```typescript
- يتم تهيئة عميل Supabase مع بيانات الاعتماد من .env
- يدعم إدارة الجلسات تلقائياً
```

### 2. Auth Context (`src/context/AuthContext.tsx`)
```typescript
- توفير حالة المستخدم والجلسة لجميع أجزاء التطبيق
- توفير دوال: signUp, signIn, signOut
- مراقبة تغييرات المصادقة
```

### 3. الشاشات

#### Sign In Screen (`src/screens/SignInScreen.tsx`)
- تسجيل دخول بالبريد الإلكتروني وكلمة المرور
- التحقق من الإدخال
- الانتقال إلى Sign Up
- بيانات تجريبية متاحة

#### Sign Up Screen (`src/screens/SignUpScreen.tsx`)
- إنشاء حساب جديد
- التحقق من تطابق كلمات المرور
- الانتقال الفوري إلى تسجيل الدخول بعد النجاح

#### Profile Screen (محدّث)
- عرض بيانات المستخدم الفعلية
- تسجيل الخروج الفعلي

## الملفات الرئيسية

```
src/
├── services/
│   └── supabase.ts           # عميل Supabase
├── context/
│   └── AuthContext.tsx       # إدارة حالة المصادقة
└── screens/
    ├── SignInScreen.tsx      # شاشة تسجيل الدخول
    ├── SignUpScreen.tsx      # شاشة إنشاء حساب
    └── ProfileScreen.tsx     # شاشة الحساب (محدّثة)

app/
├── _layout.tsx               # توجيه مشروط بناءً على حالة المصادقة
├── sign-in.tsx               # مسار Sign In
└── sign-up.tsx               # مسار Sign Up
```

## التوجيه المشروط (Conditional Navigation)

في `app/_layout.tsx`:
- إذا كان المستخدم **مسجل دخول**: عرض Tab Navigation
- إذا كان المستخدم **غير مسجل دخول**: عرض شاشات Auth (Sign In و Sign Up)

## البيانات التجريبية

يمكنك تسجيل الدخول باستخدام:
```
البريد: test@example.com
كلمة المرور: password123
```

أو إنشاء حساب جديد مباشرة من شاشة Sign Up.

## معالجة الأخطاء

- التحقق من صيغة البريد الإلكتروني
- التحقق من أن كلمة المرور 6 أحرف على الأقل
- عرض رسائل الخطأ من Supabase مباشرة للمستخدم
- معالجة أخطاء الشبكة بشكل صحيح

## متغيرات البيئة المطلوبة

في ملف `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

تم تعيينها بالفعل تلقائياً!

## كيفية الاستخدام في المكونات

```typescript
import { useAuth } from '@/src/context/AuthContext';

export default function MyComponent() {
  const { user, signOut, loading } = useAuth();

  return (
    <View>
      <Text>مرحباً {user?.email}</Text>
      <Button onPress={signOut} title="خروج" />
    </View>
  );
}
```

## الأمان

- ✅ كلمات المرور لا يتم تخزينها محلياً
- ✅ الجلسات تُدار بواسطة Supabase تلقائياً
- ✅ لا يتم تعريض مفاتيح سرية في الكود
- ✅ استخدام EXPO_PUBLIC_ للمتغيرات العامة فقط
