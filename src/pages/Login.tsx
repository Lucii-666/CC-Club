@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');

     if (!email || !password) {
       setError('Please fill in all fields');
       return;
     }

     try {
       setIsLoading(true);
-      await login(email, password, rememberMe); // ✅ pass rememberMe
+      await login(email, password);
       navigate('/');
     } catch (err) {
       setError('Invalid email or password');
     } finally {
       setIsLoading(false);
     }
   };