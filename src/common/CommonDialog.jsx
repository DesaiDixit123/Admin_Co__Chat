import PropTypes from 'prop-types';

function CommonDialog({ closeCommonDialog, CommonData }) {
    const onSuccess = () => {
        closeCommonDialog(true);
    }

    const onDismiss = () => {
        closeCommonDialog(false);
    }


    return (
        <>
            <div className="fixed inset-0 w-full h-screen bg-g1/30 backdrop-blur-sm z-50 ">
                <div className="w-full h-full py-12 px-5 overflow-y-auto flex">
                    <div className="w-full max-w-[530px] bg-white p-5 lg:p-6 2xl:p-7 rounded-xl lg:rounded-2xl 2xl:rounded-3xl space-y-3.5 lg:space-y-5 2xl:space-y-7 m-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-22 2xl:text-24 text-secondary font-bold mb-2.5 sm:mb-0">{CommonData?.title}</h2>
                        </div>
                        <p className="text-b8 font-semibold text-14 2xl:text-16 text-center">{CommonData?.description}</p>
                        <div className="flex items-center justify-between">
                            <button onClick={onDismiss} type="button" className="btn_primary text-red bg-white border-red w-full max-w-[220px] hover:text-white hover:bg-red hover:border-red">{CommonData?.buttonNames?.firstBtn}</button>
                            <button onClick={onSuccess} type="button" className="btn_primary w-full max-w-[220px]  hover:border-primary" >{CommonData?.buttonNames?.secondBtn}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

CommonDialog.propTypes = {
    closeCommonDialog: PropTypes.func,
    CommonData: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        buttonNames: PropTypes.shape({
            firstBtn: PropTypes.string,
            secondBtn: PropTypes.string,
        }),
    }),
};

export default CommonDialog;