export interface Report {
    id: string;
    reportId: number;
    contentType: string;
    reportedBy: string;
    reportedContent: string;
    reason: string;
}

export const mockReports: Report[] = [
    { id: "1", reportId: 12345, contentType: "Comment", reportedBy: "Liam Carter", reportedContent: "Offensive language in comment section", reason: "Harassment" },
    { id: "2", reportId: 12346, contentType: "Review", reportedBy: "Sophia Bennett", reportedContent: "Inappropriate review content", reason: "Spam" },
    { id: "3", reportId: 12347, contentType: "Comment", reportedBy: "Ethan Walker", reportedContent: "Misinformation in comment", reason: "Misinformation" },
    { id: "4", reportId: 12348, contentType: "Review", reportedBy: "Olivia Hayes", reportedContent: "Fake review", reason: "Fraud" },
    { id: "5", reportId: 12349, contentType: "Comment", reportedBy: "Noah Foster", reportedContent: "Hate speech in comment", reason: "Hate Speech" },
    { id: "6", reportId: 12350, contentType: "Review", reportedBy: "Ava Martinez", reportedContent: "Explicit content in review", reason: "Adult Content" },
    { id: "7", reportId: 12351, contentType: "Comment", reportedBy: "Mason Lee", reportedContent: "Spam link in comment", reason: "Spam" },
    { id: "8", reportId: 12352, contentType: "Review", reportedBy: "Isabella Wilson", reportedContent: "Misleading review", reason: "Misinformation" },
    { id: "9", reportId: 12353, contentType: "Comment", reportedBy: "James Taylor", reportedContent: "Hateful comment", reason: "Hate Speech" },
    { id: "10", reportId: 12354, contentType: "Review", reportedBy: "Charlotte Brown", reportedContent: "Fake review content", reason: "Fraud" },
    { id: "11", reportId: 12355, contentType: "Comment", reportedBy: "Benjamin Davis", reportedContent: "Spam comment", reason: "Spam" },
    { id: "12", reportId: 12356, contentType: "Review", reportedBy: "Amelia Moore", reportedContent: "Offensive language", reason: "Harassment" },
    { id: "13", reportId: 12357, contentType: "Comment", reportedBy: "Alexander Clark", reportedContent: "False information", reason: "Misinformation" },
    { id: "14", reportId: 12358, contentType: "Review", reportedBy: "Mia Lewis", reportedContent: "Adult content in review", reason: "Adult Content" },
    { id: "15", reportId: 12359, contentType: "Comment", reportedBy: "William Hall", reportedContent: "Hateful comment", reason: "Hate Speech" },
    { id: "16", reportId: 12360, contentType: "Review", reportedBy: "Harper Allen", reportedContent: "Spam review", reason: "Spam" },
    { id: "17", reportId: 12361, contentType: "Comment", reportedBy: "Michael Young", reportedContent: "Misleading comment", reason: "Misinformation" },
    { id: "18", reportId: 12362, contentType: "Review", reportedBy: "Evelyn King", reportedContent: "Fraudulent review", reason: "Fraud" },
    { id: "19", reportId: 12363, contentType: "Comment", reportedBy: "Daniel Scott", reportedContent: "Offensive comment", reason: "Harassment" },
    { id: "20", reportId: 12364, contentType: "Review", reportedBy: "Abigail Wright", reportedContent: "Adult content review", reason: "Adult Content" },
    { id: "21", reportId: 12365, contentType: "Comment", reportedBy: "Liam Carter", reportedContent: "Spam in comment", reason: "Spam" },
    { id: "22", reportId: 12366, contentType: "Review", reportedBy: "Sophia Bennett", reportedContent: "Fake review", reason: "Fraud" },
    { id: "23", reportId: 12367, contentType: "Comment", reportedBy: "Ethan Walker", reportedContent: "Hateful comment", reason: "Hate Speech" },
    { id: "24", reportId: 12368, contentType: "Review", reportedBy: "Olivia Hayes", reportedContent: "Misinformation review", reason: "Misinformation" },
    { id: "25", reportId: 12369, contentType: "Comment", reportedBy: "Noah Foster", reportedContent: "Offensive language", reason: "Harassment" },
    { id: "26", reportId: 12370, contentType: "Review", reportedBy: "Ava Martinez", reportedContent: "Spam review", reason: "Spam" },
    { id: "27", reportId: 12371, contentType: "Comment", reportedBy: "Mason Lee", reportedContent: "Hate speech comment", reason: "Hate Speech" },
    { id: "28", reportId: 12372, contentType: "Review", reportedBy: "Isabella Wilson", reportedContent: "Fraudulent review content", reason: "Fraud" },
    { id: "29", reportId: 12373, contentType: "Comment", reportedBy: "James Taylor", reportedContent: "Spam comment", reason: "Spam" },
    { id: "30", reportId: 12374, contentType: "Review", reportedBy: "Charlotte Brown", reportedContent: "Adult content review", reason: "Adult Content" },
    { id: "31", reportId: 12375, contentType: "Comment", reportedBy: "Benjamin Davis", reportedContent: "Misinformation comment", reason: "Misinformation" },
    { id: "32", reportId: 12376, contentType: "Review", reportedBy: "Amelia Moore", reportedContent: "Offensive review content", reason: "Harassment" },
    { id: "33", reportId: 12377, contentType: "Comment", reportedBy: "Alexander Clark", reportedContent: "Spam comment", reason: "Spam" },
    { id: "34", reportId: 12378, contentType: "Review", reportedBy: "Mia Lewis", reportedContent: "Fraudulent review", reason: "Fraud" },
    { id: "35", reportId: 12379, contentType: "Comment", reportedBy: "William Hall", reportedContent: "Hate speech comment", reason: "Hate Speech" },
    { id: "36", reportId: 12380, contentType: "Review", reportedBy: "Harper Allen", reportedContent: "Adult content review", reason: "Adult Content" },
    { id: "37", reportId: 12381, contentType: "Comment", reportedBy: "Michael Young", reportedContent: "Misleading comment", reason: "Misinformation" },
    { id: "38", reportId: 12382, contentType: "Review", reportedBy: "Evelyn King", reportedContent: "Spam review", reason: "Spam" },
    { id: "39", reportId: 12383, contentType: "Comment", reportedBy: "Daniel Scott", reportedContent: "Offensive comment", reason: "Harassment" },
    { id: "40", reportId: 12384, contentType: "Review", reportedBy: "Abigail Wright", reportedContent: "Fake review content", reason: "Fraud" },
    { id: "41", reportId: 12385, contentType: "Comment", reportedBy: "Liam Carter", reportedContent: "Hate speech comment", reason: "Hate Speech" },
    { id: "42", reportId: 12386, contentType: "Review", reportedBy: "Sophia Bennett", reportedContent: "Adult content review", reason: "Adult Content" },
    { id: "43", reportId: 12387, contentType: "Comment", reportedBy: "Ethan Walker", reportedContent: "Spam comment", reason: "Spam" },
    { id: "44", reportId: 12388, contentType: "Review", reportedBy: "Olivia Hayes", reportedContent: "Misinformation review", reason: "Misinformation" },
    { id: "45", reportId: 12389, contentType: "Comment", reportedBy: "Noah Foster", reportedContent: "Offensive comment", reason: "Harassment" },
    { id: "46", reportId: 12390, contentType: "Review", reportedBy: "Ava Martinez", reportedContent: "Fraudulent review content", reason: "Fraud" },
    { id: "47", reportId: 12391, contentType: "Comment", reportedBy: "Mason Lee", reportedContent: "Hate speech comment", reason: "Hate Speech" },
];
