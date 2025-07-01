//HOOK FRO LOGIN FUNCTION
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../lib/api';

const useLogIn = () => {
      const queryClient = useQueryClient();
      const { mutate, isPending, error } = useMutation({
      mutationFn: login,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authUser"]});
        // Redirect or show success message
      },
    });

    return { loginMutation: mutate, isPending, error };
}

export default useLogIn
