# Take in data, take (possibly many) steps to tidy it, re-output
# Author: Reed Spool
library(reshape)

# You might need to point the following to the data directory on your computer.
setwd('/Users/reed/work/graphicacy/IN_PROGRESS/AA3/data')

csv.all.in <- "FINAL-9-21-14/UPDATED.AA3.data.website.SLUGS.ADDED/All states-Table 1.csv"
csv.afam.hisp.in <- "FINAL-9-21-14/UPDATED.AA3.data.website.SLUGS.ADDED/AfAm and Hisp-Table 1.csv"
csv.out <- "FINAL-9-21-14/tidied/All_states_TIDY.csv"

reportAll <- read.csv(csv.all.in, strip.white = TRUE)
reportAfAmHisp <- read.csv(csv.afam.hisp.in, strip.white = TRUE)


cleanReport <- function (report) {
  # Delete the second row, which is meaningless (note: base change from spreadsheet view, first row is in data frame's names)
  report <- report[-1,]
  
  # Harvest names for manipulation
  namen <- names(report)
  
  # And give the bad names something useful
  namen[1] <- 'question.slug'
  
  # Now put them back
  names(report) <- namen
  
  melted <- melt(report, id=c('question.slug'))
  
  # Change the names of the new long-form, melted dataset
  names(melted) <- c('slug', 'state', 'answer')
  
  # Remove all rows with empty questions (cruft from XLS format)
  melted <- melted[melted$slug != '', ]
  
  # Remove all rows with bad states
  melted <- melted[melted$state != 'X', ]
  
  return(melted)
}

A <- cleanReport(reportAll)
B <- cleanReport(reportAfAmHisp)

AB <- rbind(A, B)

# Finally, write out
write.csv(AB, file=csv.out, row.names=FALSE)