<div className="space-y-5">
  <div className=" ">
    <h2 className="text-lg font-semibold text-darkBlueGray">
      Recent Campaigns
    </h2>
    <p className="text-inkyBlue mt-1 text-sm">Your latest message campaigns</p>
  </div>

  {/* Campaigns Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {campaigns.map((campaign, index) => (
      <div key={index} className="border- rounded-lg bg-white p-4 ">
        <div className="bg-lightGrayishBlue p-1 w-6 rounded-sm mb-4">
          <MessageSquareText size={16} className="text-deepPurple" />
        </div>

        <div className="text-center mb-4">
          <div className="flex gap-1 sm:gap-2 mb-2 flex-wrap">
            <span className="text-xs font-normal bg-paleBlueGray text-darkBlueGray px-2 py-1 rounded-[6px]">
              SMS
            </span>
            <span className="text-xs font-normal bg-paleBlueGray text-darkBlueGray px-2 py-1 rounded-[6px]">
              Email
            </span>
            <span className="text-xs font-normal bg-fadedGreen text-whatsappGreen px-2 py-1 rounded-[6px]">
              Completed
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-darkBlueGray text-center mb-4 text-sm sm:text-base leading-tight">
          {campaign.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-lightSlateGray text-sm sm:text-base font-medium">
              Sent: <span className="text-blueBayoux">{campaign.sent}</span>
            </span>
            <span className="text-lightSlateGray text-sm sm:text-base font-medium">
              Delivered:
              <span className="text-blueBayoux">{campaign.delivered}</span>
            </span>
          </div>
          <div className="w-full bg-paleBlueGray rounded-full h-2">
            <div
              className="bg-deepPurple h-2 rounded-full"
              style={{
                width: `${(campaign.delivered / campaign.sent) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <p className="text-sm font-medium text-blueBayoux">{campaign.date}</p>
      </div>
    ))}
  </div>
</div>;
