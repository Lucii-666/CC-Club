@@ .. @@
   const [email, setEmail] = useState('');
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);
-  const { resetPassword, isLoading } = useAuth();
+  const { resetPassword } = useAuth();
+  const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     setSuccess(false);

     if (!email) {
       setError('Please enter your email address');
       return;
     }

-    if (!email.endsWith('@marwadiuniversity.ac.in')) {
-      setError('Please use your university email address');
-      return;
-    }
+    try {
+      setIsLoading(true);
+      const result = await resetPassword(email);
+      if (result) {
+        setSuccess(true);
+      } else {
+        setError('Failed to send reset email. Please try again.');
+      }
+    } catch (err) {
+      setError('An error occurred. Please try again.');
+    } finally {
+      setIsLoading(false);
+    }
-
-    const result = await resetPassword(email);
-    if (result) {
-      setSuccess(true);
-    } else {
-      setError('No account found with this email address');
-    }
   };