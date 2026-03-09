from django.shortcuts import render
from rest_framework.views import APIView
from .models import profile
from rest_framework.response import Response
from .serializer import ProfileSerializer
from  rest_framework import status

# Create your views here.

class profileApi(APIView):

    def get_objects(self,id):
            try:
                return profile.objects.get(id=id)
            except profile.DoesNotExist:
                return None
        
        
    def get(self,request,id):
        user=self.get_objects(id)
        if user is None:
            return  Response({'message':'user id does not exist'},status=status.HTTP_404_NOT_FOUND)

        
        seria=ProfileSerializer(user)
       
        return Response({'message':seria.data},status=status.HTTP_200_OK)
    
    def put(self,request,id):
        user=self.get_objects(id)
        seria=ProfileSerializer(user,data=request.data)
        if seria.is_valid():
           seria.save()
           return Response({'message':'User update succesfully',
                            'data':seria.data},status=status.HTTP_200_OK)
        return Response({'message':'User update mot succesfull',
                         'data':seria.errors },status=status.HTTP_400_BAD_REQUEST)
    
        
    def patch(self,request,id):
        user=self.get_objects(id)
        if user is None:
            return Response({'message': 'User does not exist'}, status=404)
        seria=ProfileSerializer(user,data=request.data,partail=True)
        if seria.is_valid():
           seria.save()
           return Response({'message':'User update succesfully',
                            'data':seria.data},status=status.HTTP_200_OK)
        return Response({'message':'User update mot succesfull',
                        'data':seria.errors },status=status.HTTP_400_BAD_REQUEST)
    


      
      

        

