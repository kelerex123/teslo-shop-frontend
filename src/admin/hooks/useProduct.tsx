import { createUpdateAction } from "@/shop/actions/create-update.action";
import { getProductByIdAction } from "@/shop/actions/get-product-by-id.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useProduct = (id: string) => {

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['product', { id }],
        queryFn: () => getProductByIdAction(id),
        retry: false,
        staleTime: 1000 * 60 * 5,
    });


    const mutation = useMutation({
        mutationFn: createUpdateAction,
        onSuccess: (product) => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['product', { id: product.id }] })
            // Actualizar queryData
            queryClient.setQueryData(['products', { id: product.id }], product)
        }
    });

    // const handleSubmitForm = async (productLike: Partial<Product>) => {

    //     console.log({ productLike })

    // }

    return {
        ...query,
        mutation,
    }
}