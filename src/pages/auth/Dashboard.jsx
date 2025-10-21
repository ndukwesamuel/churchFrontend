import emoji from "../../assets/images/upscale_image [Upscaled].png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutateData } from "../../hook/Request";
import { logindispatch } from "../../redux/AuthSlice";
import { ArrowRight } from "lucide-react";
const Dashboard = ({ data }) => {
  const { mutateAsync: loginMutation } = useMutateData("auth");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginMutation({
        url: "/api/v1/auth/signin",
        data,
      });

      if (response?.error) {
        console.error(response.error);
      } else {
        dispatch(logindispatch(response));
        navigate("/dashboard"); // go to real dashboard
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form className="space-y-6 text-center" onSubmit={onSubmit}>
      <div className="mb-6 p-3 bg-vanessa rounded-full border-8 border-paleBlue w-fit mx-auto">
        <img src={emoji} alt="Success" className="w-28" />
      </div>
      <h1 className="text-2xl font-semibold text-darkBlueGray">
        Your ChurchComm Account is Ready!
      </h1>
      <p className="text-blueBayoux mb-3 text-sm nd:text-base">
        You're all set to manage your church operations with ChurchComm.
      </p>

      <button
        type="submit"
        className="bg-deepPurple text-white px-7 py-3 rounded-full hover:bg-deepPurpletransition"
      >
        Go To Dashboard <ArrowRight />
      </button>
    </form>
  );
};

export default Dashboard;
