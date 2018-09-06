import csv
import os

class apriori():
    def __init__(self):
        self.filepath = os.getcwd()+"./dataset"
        self.filename = "test_janelle.csv"
        self.dataset = self.filepath + "/" + self.filename
        self.transaction_count = 0
        self.threshold_percent = 0.45
        self.threshold_count = 0
        self.tuples = 10

    def open_dataset(self):
        transactions = []
        lines = csv.reader(open(self.dataset, "r"))
        dataset = list(lines)
                 # Office        Date           Item
        labels = [dataset[0][2], dataset[0][0], dataset[0][4]]
        for i in range(1, len(dataset)):
            occured = False
            j = [dataset[i][2], dataset[i][0], dataset[i][4].split('//')]
            j[0] = j[0].rstrip().lstrip()
            j[1] = j[1].rstrip().lstrip()
            j[2] = [v.rstrip().lstrip() for v in j[2]]
            for k in transactions:
                if k[0] == j[0] and k[1] == j[1]:
                    occured = True
                    k[2].append(j[2][0])
                    break
            if occured is False:
                transactions.append(j)

        self.transaction_count = len(transactions)
        self.threshold = int(self.transaction_count * self.threshold_percent)
        print(self.transaction_count)
        print(self.threshold)
        myFile = open('./output/input_data.csv', 'w', newline='')
        with myFile:
            writer = csv.writer(myFile)
            writer.writerows(transactions)
        # for i in transactions:
        #     print(i[0],i[1])
        #     print('--')
        #     for j in i[2]:
        #         print(j)
        #     print('===========')
        # exit()
        return labels, transactions

    def check_for_occurance(self, item, item_set):
        if item in item_set:
            return True
        else:
            return False

    def sublist(self, lst1, lst2):
        ls1 = [v for v in lst1 if v in lst2]
        ls2 = [v for v in lst2 if v in lst1]
        # ls1 = list()
        # for i in range(len(lst1)):
        #     for j in range(len(lst2)):
        #         if lst1[i] == lst2[j]:
        #             ls1.append(lst1[i])
        if ls1 == lst1 and ls1 == ls2:
            return True
        else:
            return False

    def item_list(self, dataset):
        list_of_unique_items = []
        for i in dataset:
            items = i[2]
            for j in items:
                temp_item = j
                occurance = self.check_for_occurance(temp_item, list_of_unique_items)
                if occurance is False:
                    list_of_unique_items.append(temp_item)
        return list_of_unique_items

    def count_frequency(self, items, dataset):
        items_with_freq = []
        for i in items:
            count = 0
            for j in range(len(dataset)):
                for k in range(len(dataset[j][2])):
                    if dataset[j][2][k] == i:
                        count += 1
                        break;
            items_with_freq.append([i, count])
        return items_with_freq

    def filter_threshold(self, item_set):
        items = item_set[:]
        for i in range(len(items)-1, -1, -1):
            if(items[i][1] <= self.threshold):
                del items[i]
        return items

    def self_join(self, lst1, lst2, n):
        common = [v for v in lst1 if v in lst2]
        combined_uncommon = list()
        for i in range(n):
            if lst1[i] not in common:
                combined_uncommon.append(lst1[i])
            if lst2[i] not in common:
                combined_uncommon.append(lst2[i])
        new_item = common[:]
        if len(combined_uncommon) == 2:
            new_item.append(combined_uncommon[0])
            new_item.append(combined_uncommon[1])
            return new_item, True
        else:
            return new_item, False

    def count_frequency_tuple(self, sub_lists, dataset):
        tuples_with_freq = []
        for i in sub_lists:
            counter = 0
            for j in dataset:
                bool= self.sublist(i,j[2])
                if bool == True:
                    counter += 1
            tuples_with_freq.append([i,counter])
        return tuples_with_freq

    def create_tuples(self, item_sets):
        temp_item_set = []
        sub_list = []
        #Create 2-tuple item sets
        if type(item_sets[0][0]) is not list:
            for i in range(len(item_sets)):
                for j in range(i+1, len(item_sets)):
                    sub_list = [item_sets[i][0], item_sets[j][0]]
                    bool = self.sublist(sub_list, [v[0] for v in item_sets])
                    if bool == True:
                        temp_item_set.append(sub_list)
        # Apply self-join rule
        else:
            tuple_count = len(item_sets[0][0])
            stack = list()
            for i in range(len(item_sets)):
                for j in range(i+1, len(item_sets)):
                    appeared = False
                    new_item, joined = self.self_join(item_sets[i][0], item_sets[j][0], tuple_count)
                    if joined == True:
                        if not temp_item_set:
                            temp_item_set.append([v for v in new_item])
                        else:
                            for k in temp_item_set:
                                stack = new_item[:]
                                for l in k:
                                    if l in stack:
                                        stack.remove(l)
                                if not stack:
                                    appeared = True
                                    break
                            if not appeared:
                                temp_item_set.append([v for v in new_item])
        return temp_item_set

    def create_csv(self, item_sets):
        counter = 1
        for tuples in item_sets:
            if type(tuples[0][0]) is not str:
                data = []
                for i in tuples:
                    temp_list = []
                    for j in i[0]:
                        temp_list.append(j)
                    temp_list.append(i[1])
                    data.append(temp_list)
                tuples = data[:]
            filename = './output/'+str(counter)+'-tuple.csv'
            myFile = open(filename, 'w', newline='')
            with myFile:
                writer = csv.writer(myFile)
                writer.writerows(tuples)
            counter += 1
            filename = './output/parameters.txt'
            myFile = open(filename, 'w', newline='')
            with myFile:
                write_line = 'Support Threshold: '+str(self.threshold_percent*100)+'%'
                myFile.write(write_line)
				
    def main(self):
        # Load Dataset
        labels, dataset = self.open_dataset()
        # Get Individual Items
        all_items = self.item_list(dataset)
        # Count Items occurance for each transaction if any
        all_items_with_frequency = self.count_frequency(all_items, dataset)
        all_items_with_frequency.sort()

        # Eliminate item set with no occurence atleast with the threshold
        filtered_items = self.filter_threshold(all_items_with_frequency)

        # Initialize a list with 1-tuple of items
        items_per_tuple = []
        item_sets = filtered_items[:]
        temp_set = []
        temp_set_with_frequency = []
        temp_set_filtered = []

        items_per_tuple.append(item_sets)
        # Create sets up to n-tuples
        for i in range(2, self.tuples+1):
            temp_set = self.create_tuples(item_sets)
            temp_set_with_frequency = self.count_frequency_tuple(temp_set, dataset)
            temp_set_filtered = self.filter_threshold(temp_set_with_frequency)

            item_sets = temp_set_filtered[:]

            if item_sets:
                items_per_tuple.append(item_sets[:])

            if len(item_sets) <= 0:
                print('Items no longer exist at ',i,'-tuple')
                break

        # Output Sets
        # if len(items_per_tuple) > 0 and items_per_tuple[0]:
        self.create_csv(items_per_tuple)
        # for i in temp_set_filtered:
        #     print(i)

if __name__ == '__main__':
    apriori = apriori()
    apriori.main()
