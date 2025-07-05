
# Security Setup Guide

## Critical: Supabase Row Level Security (RLS) Setup

**⚠️ IMPORTANT: These SQL commands MUST be executed in your Supabase SQL Editor before going to production!**

### 1. Enable Row Level Security

```sql
-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 2. Create RLS Policies for Projects Table

```sql
-- Allow users to see only their own projects
CREATE POLICY "projects_select_own" ON projects 
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert projects only for themselves
CREATE POLICY "projects_insert_own" ON projects 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own projects
CREATE POLICY "projects_update_own" ON projects 
FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete only their own projects
CREATE POLICY "projects_delete_own" ON projects 
FOR DELETE USING (auth.uid() = user_id);
```

### 3. Create RLS Policies for Profiles Table

```sql
-- Allow users to see only their own profile
CREATE POLICY "profiles_select_own" ON profiles 
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert only their own profile
CREATE POLICY "profiles_insert_own" ON profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own profile
CREATE POLICY "profiles_update_own" ON profiles 
FOR UPDATE USING (auth.uid() = user_id);
```

### 4. Verify RLS Policies are Active

```sql
-- Check that RLS is enabled
SELECT schemaname, tablename, rowsecurity, enablerls 
FROM pg_tables 
WHERE tablename IN ('projects', 'profiles');

-- List all policies
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('projects', 'profiles');
```

## Environment Variables Setup

### Required Supabase Environment Variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Security Features Implemented

### ✅ Authentication Security
- Strong password requirements (min 8 chars, uppercase, lowercase, number)
- Email validation and sanitization
- Rate limiting for login/signup attempts (5 login, 3 signup per hour)
- Secure error handling without system detail exposure

### ✅ Input Validation & Sanitization
- Comprehensive Zod schema validation for all user inputs
- XSS prevention through input sanitization
- UUID validation for all IDs
- Project name length and character restrictions

### ✅ Security Headers & CSP
- Content Security Policy configured for development and production
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection enabled
- Referrer-Policy: strict-origin-when-cross-origin

### ✅ Security Monitoring
- Security event logging for suspicious activities
- Failed login attempt tracking
- Unusual access pattern detection
- Rate limit violation monitoring

### ✅ Data Protection
- Complete user data isolation through RLS policies
- Secure project data access (users can only access their own projects)
- Protected profile information
- Audit trail for all database operations

## Production Checklist

Before deploying to production:

1. ✅ Execute all RLS policy SQL commands in Supabase
2. ✅ Set proper environment variables
3. ✅ Test user data isolation
4. ✅ Verify security headers are applied
5. ✅ Test rate limiting functionality
6. ✅ Review and reduce development logging

## Monitoring & Alerts

The application logs security events that should be monitored:
- `failed_login`: Failed authentication attempts
- `rapid_requests`: Rate limit violations
- `unusual_access`: Suspicious database access patterns
- `data_export`: Large data exports (future feature)

Consider setting up alerts for these events in your production monitoring system.
