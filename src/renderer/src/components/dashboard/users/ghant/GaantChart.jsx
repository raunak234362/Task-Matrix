/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, differenceInDays } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelector } from "react-redux";
import Service from "../../../../api/configAPI";

export default function GanttChart() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [taskDetails, setTaskDetails] = useState([]);

  const staffs = useSelector((state) => state?.userData?.staffData);

  useEffect(() => {
    async function fetchTasksForUser() {
      if (selectedUser) {
        try {
          const tasks = await Service.fetchCalendar2(
            new Date().toISOString(),
            selectedUser.username,
          );
          setTaskDetails(
            tasks.map((task) => ({
              name: `${task.project} - ${task.task}`,
              start: parseISO(task.created_on),
              end: parseISO(task.due_date),
              duration: differenceInDays(
                parseISO(task.due_date),
                parseISO(task.created_on),
              ),
            })),
          );
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    }
    fetchTasksForUser();
  }, [selectedUser]);

  const minDate =
    taskDetails.length > 0
      ? Math.min(...taskDetails.map((d) => d.start.getTime()))
      : 0;
  const maxDate =
    taskDetails.length > 0
      ? Math.max(...taskDetails.map((d) => d.end.getTime()))
      : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Tasks Gantt Chart</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedUser
              ? `${selectedUser.f_name} ${selectedUser.l_name}`
              : "Select user..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup>
                {staffs?.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => {
                      setSelectedUser(user);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedUser?.id === user.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {user.f_name} {user.l_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedUser && taskDetails.length > 0 && (
        <div className="mt-8 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={taskDetails}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <XAxis
                type="number"
                domain={[minDate, maxDate]}
                tickFormatter={(unixTime) =>
                  format(new Date(unixTime), "MM/dd/yyyy")
                }
              />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip
                labelFormatter={(value) => `Task: ${value}`}
                formatter={(value, name) => {
                  if (name === "start")
                    return format(new Date(value), "MM/dd/yyyy");
                  if (name === "end")
                    return format(new Date(value), "MM/dd/yyyy");
                  return value;
                }}
              />
              <Bar dataKey="duration" fill="hsl(var(--primary))" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
