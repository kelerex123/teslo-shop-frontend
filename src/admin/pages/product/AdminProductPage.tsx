import { Navigate, useNavigate, useParams } from 'react-router';

import { useProduct } from '@/admin/hooks/useProduct';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { ProductForm } from './ui/ProductForm';
import type { Product } from '@/types/product.interface';
import { toast } from 'sonner';

export const AdminProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { isLoading, isError, data: product, mutation } = useProduct(id || '');

    const title = id === 'new' ? 'Nuevo producto' : 'Editar producto';
    const subtitle =
        id === 'new'
            ? 'Aquí puedes crear un nuevo producto.'
            : 'Aquí puedes editar el producto.';

    // TODO: Por eliminar

    const handleSubmit = async (productLike: Partial<Product> & { files?: File[] }) => {

        await mutation.mutateAsync(productLike, {
            onSuccess: (data) => {
                toast.success('Producto actualizado correctamente', {
                    position: 'top-right'
                });
                navigate(`/admin/products/${data.id}`)
            },
            onError: (_error) => {
                toast.error('Error al actualizar el producto');
            }
        })
    }

    if (isLoading) {
        return <CustomFullScreenLoading />
    }

    if (isError) {
        return <Navigate to="/admin/products" />
    }


    if (!product) {
        return <Navigate to="/admin/products" />
    }

    return (
        <ProductForm
            title={title}
            subtitle={subtitle}
            product={product}
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
            isSuccess={mutation.isSuccess}
        />
    )

};