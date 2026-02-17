import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import TransactionForm from "../components/TransactionForm";

export default function AddTransaction() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleAddTransaction = async (data) => {
        try {
            await addDoc(collection(db, "transactions"), {
                ...data,
                userId: currentUser.uid,
                createdAt: new Date(),
            });
            navigate("/");
        } catch (error) {
            console.error("Error adding transaction: ", error);
            alert("Error saving transaction");
        }
    };

    return (
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <TransactionForm
                onSave={handleAddTransaction}
                isModal={false}
            />
        </div>
    );
}
