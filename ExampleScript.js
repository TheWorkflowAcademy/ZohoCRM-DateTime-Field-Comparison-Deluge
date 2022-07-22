opps = zoho.crm.getRelatedRecords("Deals", "Contacts", contactId);
oppLatestDateMap = Map();
if (opps.size() > 0)
{
	for each o in opps
	{
		// Init latestDate
		latestDate = "01-Jan-1900 00:00:00";
		// Get related Smooth Messages records
		oppMessages = zoho.crm.getRelatedRecords("Twilio_Messages", "Deals", o.get("id"));
		if (oppMessages.size() > 0)
		{
			for each om in oppMessages
			{
				createdTime = om.get("Created_Time");
				createdTime_f = createdTime.left(createdTime.indexOf("T")).toDate() + " " + createdTime.subString(createdTime.indexOf("T")+1,createdTime.lastIndexOf("-"));
				if (latestDate.toDateTime() < createdTime_f.toDateTime())
				{
					latestDate = createdTime_f;
					latestOppId = o.get("id");
				}
			}
			oppLatestDateMap.put(latestOppId,latestDate);
		}

	}
}
info oppLatestDateMap;
if (!oppLatestDateMap.isEmpty())
{
	// Init latestDate
	latestDate = "01-Jan-1900 00:00:00";
	for each oldm in oppLatestDateMap.keys()
	{
		if (latestDate.toDateTime() < oppLatestDateMap.get(oldm).toDateTime())
		{
			latestOppId = oldm;
		}
	}
	info latestOppId;
}
else
{
	info "There are no messages for this customer.";
}
