import FormToggler from "./Forms";



const Auth = () => {
    
	return  (
		<main className="flex flex-col items-center justify-center pb-8 min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#A0D6D3]/20">
			<div className="absolute inset-0 overflow-hidden pointer-events-none ">
              <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#004E7C]/10 to-[#A0D6D3]/20 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#F5B700]/10 to-[#FFC933]/20 rounded-full blur-3xl" />
            </div>
            {/* // page content */}
            <div className="text-white">.</div>

            <div  className=" bg-white/95 backdrop-blur-sm p-4  shadow-2xl mx-auto   w-fit min-w-sm rounded-xl border-0 z-10">
                <FormToggler/>
            </div>
		</main>
	);
};





export default Auth;
