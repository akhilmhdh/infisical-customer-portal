"use client"
import { useRouter } from 'next/navigation';
import {
    TableContainer,
    Table,
    THead,
    Tr,
    Td,
    Th,
    TBody,
    TableSkeleton,
    Button,
    EmptyState
} from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    apiRequest 
} from '../config';
import { 
  useGetOrganizations,
  useGetPmtMethods,
  useAddPmtMethod,
  useGetCloudSubs,
  useManageCloudSubs,
  useLogoutUser
} from '@/hooks/api';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

// TODO: layout, license stuff etc.

// we want: test STRIPE_KEY to get customer information?
// display Cloud stuff as well here or no?

// connect to Stripe
// AKA fetching data!
// render Cloud Plan
// render licenses
// set up table structure


// ---

// They want to upgrade plan so they will press the button they need to
// Check will run and it turns out that they need to add a payment method -> modal will open
// to notify them that no payment method is on file
// They press to add payment method
// They add and return back
// They try again and this time it should work

// TODO 1: Cloud
// TODO 2: Self-hosted licenses (maybe these just appear because it depends on the negotiated deal).

const EMAILS = [
    {
        email: 'dangtony98@gmail.com'
    },
    {
        email: 'dangtony98+1@gmail.com'
    }
];

export default function DashboardPage() {
  const router = useRouter();
    const { data, isLoading, isFetching, error } = useGetOrganizations();
    const { data: paymentMethodsData, isLoading: isLoading2 } = useGetPmtMethods('6458b874d2875a461d6fe94f');

    const { data: cloudPlans } = useGetCloudSubs('6458b874d2875a461d6fe94f');
    
    const addPmtMethod = useAddPmtMethod();
    const manageCloudSubs = useManageCloudSubs();
    const logoutUser = useLogoutUser();
    
    console.log('cloudPlans: ', cloudPlans);
    
    if (!isLoading) {
        console.log('data: ', data);
    }
    
    if (!isLoading2) {
      console.log('paymentMethodsData: ', paymentMethodsData);
    }
    
    const handleAddPmtMethodBtnClick = async () => {
      console.log('handleClick');
      
      const x = await addPmtMethod.mutateAsync('');
      window.location.href = x;
      console.log('x', x);
    }
    
    const handleMngCloudSubscriptionBtnClick = async () => {
      console.log('y');
      
      const y = await manageCloudSubs.mutateAsync('');
      window.location.href = y;
      console.log('y y: ', y);
    }
  
    const handleLogoutBtnClick = async () => {
      console.log('handleLogoutBtnClick');
      const z = await logoutUser.mutateAsync();
      console.log('z: ', z);
      router.push('/auth/login');
    }

    return (
        <div>
            Hello from the Dashboard Page
            <div>
                <Button 
                  onClick={handleLogoutBtnClick}
                  color="mineshaft" 
                  className='mt-4'
                  isLoading={isLoading}
                >
                  Logout
                </Button>
            </div>
            <div>
              <h1>Cloud part</h1>
              {!isLoading2 && paymentMethodsData.length === 0 && (
                <Button 
                  onClick={handleAddPmtMethodBtnClick}
                  color="mineshaft" 
                  className='mt-4'
                  isLoading={isLoading}
                >
                  Add payment method
                </Button>
              )}
              {!isLoading2 && paymentMethodsData.length > 0 && (
                <Button 
                  onClick={handleMngCloudSubscriptionBtnClick}
                  color="mineshaft" 
                  className='mt-4'
                  isLoading={isLoading}
                >
                  Manage subscription
                </Button>
              )}
            </div>
            <div>Self-hosted part</div>
            <TableContainer>
          <Table>
            <THead>
              <Tr>
                <Th>Email</Th>
                <Th aria-label="actions" />
              </Tr>
            </THead>
            <TBody>
              {/* {isLoading && <TableSkeleton columns={2} key="incident-contact" />} */}
              {EMAILS.map(({ email }) => (
                <Tr key={email}>
                  <Td className="w-full">{email}</Td>
                  {/* <Td className="mr-4">
                    <IconButton
                      ariaLabel="delete"
                      colorSchema="danger"
                      onClick={() => handlePopUpOpen('removeContact', { email })}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Td> */}
                </Tr>
              ))}
            </TBody>
          </Table>
          {/* {filteredContacts?.length === 0 && !isLoading && (
            <EmptyState title="No incident contacts found" icon={faContactBook} />
          )} */}
        </TableContainer>
        </div>
    );
}