# Take in data, take (possibly many) steps to tidy it, re-output
# Author: Reed Spool
library(reshape)

# You might need to point the following to the data directory on your computer.
setwd('/Users/reed/work/graphicacy/IN_PROGRESS/AA3/data')

csv.in <- "FINAL-9-21-14/StateLevelProjections_2014_EDITED/prepped-Table 1.csv"
csv.out <- "FINAL-9-21-14/StateLevelProjections_2014_EDITED/prepped_and_processed.csv"
report <- read.csv(csv.in, strip.white = TRUE, row.names = 1)

rowNames <- row.names(report)

# Strip out %, change to numeric val
report <- sapply(report, function (d) { return(as.numeric(sub('%', '', d))) })

row.names(report) <- rowNames

national <- data.frame(round(rowMeans(report[,1:51]), 1))

names(national) <- 'National'

report <- merge(report, national, by=0)

# Reorder so National col is second, not last
report <- report[,c(1,53,2:52)]

colNames <- names(report)

colNames[1] <- 'question.slug'

names(report) <- colNames

write.csv(report, file=csv.out, row.names=FALSE)