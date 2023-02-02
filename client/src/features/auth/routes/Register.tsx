import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { RegisterForm } from '../components/RegisterForm';

export const Register = () => {
    const navigate = useNavigate();

    return (
        <Layout title="Nýskráning">
            <RegisterForm onSuccess={() => navigate('/app')} />
        </Layout>
    );
};
