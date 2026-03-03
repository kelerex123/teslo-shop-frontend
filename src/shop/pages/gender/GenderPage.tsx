import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomJumbotron } from "@/shop/components/CustomJumbotron"
import { ProductsGrid } from "@/shop/components/ProductsGrid"
import { useProducts } from "@/shop/hooks/useProducts"
import { Navigate, useParams } from "react-router"

export const GenderPage = () => {

    const { data } = useProducts();

    const { gender } = useParams();
    let genderLabel = '';

    switch (gender) {
        case 'men':
            genderLabel = 'Hombres'
            break;
        case 'women':
            genderLabel = 'Mujeres'
            break;
        case 'kid':
            genderLabel = 'Niños'
            break;

        default:
            break;
    }

    if (genderLabel === '')
        return <Navigate to='/' />

    return (
        <>
            <CustomJumbotron title={'Productos para ' + genderLabel} />

            <ProductsGrid products={data?.products || []} />

            <CustomPagination totalPages={data?.pages || 0} />
        </>
    )
}