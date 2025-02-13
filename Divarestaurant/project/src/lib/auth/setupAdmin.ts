import { supabase } from '../supabase/client';

export async function setupAdminAccount() {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  try {
    // Vérifier si le compte admin existe déjà
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (existingUser) {
      console.log('Admin account already exists');
      return;
    }

    // Créer le compte admin
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'admin',
          is_admin: true
        }
      }
    });

    if (signUpError) throw signUpError;

    // Créer le profil admin
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: adminEmail,
            role: 'admin',
            is_admin: true
          }
        ]);

      if (profileError) throw profileError;
    }

    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Error setting up admin account:', error);
    throw error;
  }
}